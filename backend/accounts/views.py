from rest_framework import generics, permissions, status, mixins
from rest_framework.exceptions import PermissionDenied, ValidationError
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from django.views.decorators.vary import vary_on_cookie
from allauth.account.models import EmailAddress
from allauth.account.utils import complete_signup
from allauth.account import app_settings as allauth_settings
from dj_rest_auth.views import LoginView
from dj_rest_auth.registration.views import RegisterView
from rest_framework_simplejwt.tokens import RefreshToken

from .models import *
from .serializers.profile_serializers import *
from .serializers.auth_serializers import *
from .permissions import *

User = get_user_model()


# ==========================
# Base Profile View Classes
# ==========================

class BaseSellerProfileView:
    """Base class for seller profile views with common functionality"""
    permission_classes = [permissions.IsAuthenticated, IsSeller]
    
    def get_profile(self, user):
        """Get or create seller profile with validation"""
        if not user.is_seller:
            raise PermissionDenied("Only sellers can access this.")
        return get_object_or_404(SellerProfile, user=user)


# ==========================
# Seller Profile Setup View (Create/Update)
# ==========================

class SellerProfileSetupView(
    BaseSellerProfileView,
    mixins.UpdateModelMixin,
    generics.GenericAPIView
):
    """
    View for setting up and updating seller profiles.
    
    This view allows sellers to:
    - Update their profile information
    - Add/update education, skills, languages, and portfolio items
    - Track profile completion status
    """
    serializer_class = SellerProfileSetupSerializer
    permission_classes = [permissions.IsAuthenticated, IsSeller, IsSellerProfileOwner]
    
    def get_object(self):
        return self.get_profile(self.request.user)
    
    @method_decorator(cache_page(60 * 15))  # Cache for 15 minutes
    @method_decorator(vary_on_cookie)
    def get(self, request, *args, **kwargs):
        """Get the seller's profile"""
        return self.retrieve(request, *args, **kwargs)
    
    def patch(self, request, *args, **kwargs):
        """Partial update endpoint"""
        return self.partial_update(request, *args, **kwargs)
    
    def put(self, request, *args, **kwargs):
        """Full update endpoint"""
        return self.update(request, *args, **kwargs)


# ==========================
# Seller Profile Detail View (Read)
# ==========================

class SellerProfileDetailView(
    BaseSellerProfileView,
    generics.RetrieveAPIView
):
    """
    View for retrieving seller profile details.
    
    This view provides:
    - Public access to seller profiles
    - Detailed profile information including education, skills, languages, and portfolio
    - Profile completion status
    """
    serializer_class = SellerProfileSetupSerializer
    permission_classes = [permissions.AllowAny]  # Public access
    lookup_field = None  # We handle lookup in get_object
    
    def get_object(self):
        return self.get_profile(self.request.user)
    
    def get_serializer_context(self):
        """Add request to serializer context"""
        return {'request': self.request}


# ==========================
# Seller Profile Delete View
# ==========================

class SellerProfileDeleteView(
    BaseSellerProfileView,
    generics.DestroyAPIView
):
    """
    View for deleting seller profiles.
    
    This view:
    - Allows sellers to delete their profiles
    - Handles cleanup of related data
    - Updates user role and status
    """
    serializer_class = SellerProfileSetupSerializer
    permission_classes = [permissions.IsAuthenticated, IsSeller, IsSellerProfileOwner]
    
    def get_object(self):
        return self.get_profile(self.request.user)
    
    def perform_destroy(self, instance):
        """Handle additional cleanup when deleting profile"""
        user = instance.user
        user.is_seller = False
        if user.current_role == 'seller':
            user.current_role = 'buyer'
        user.save()
        instance.delete()
    
    def delete(self, request, *args, **kwargs):
        """Enhanced delete response"""
        self.destroy(request, *args, **kwargs)
        return Response(
            {"detail": "Seller profile successfully deleted."},
            status=status.HTTP_204_NO_CONTENT
        )


# ==========================
# Become Seller View
# ==========================

class BecomeSellerView(generics.GenericAPIView):
    """
    View for converting a user to a seller.
    
    This view:
    - Converts a regular user to a seller
    - Creates an initial seller profile
    - Updates user role and status
    """
    permission_classes = [permissions.IsAuthenticated, IsVerifiedUser]
    serializer_class = CustomUserDetailsSerializer
    throttle_scope = 'become_seller'
    
    def post(self, request):
        """Convert user to seller with profile creation"""
        user = request.user
        
        if user.is_seller:
            return Response(
                {'error': 'User is already a seller'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Convert to seller
        user.is_seller = True
        user.current_role = 'seller'
        user.save()
        
        # Create profile if doesn't exist
        SellerProfile.objects.get_or_create(user=user)
        
        serializer = self.get_serializer(user, context={'request': request})
        return Response({
            'status': 'success',
            'message': 'You are now a seller',
            'user': serializer.data
        })


# ==========================
# Enhanced Switch Role View
# ==========================

class SwitchRoleView(generics.GenericAPIView):
    """
    View for switching between buyer and seller roles.
    
    This view:
    - Allows users to switch between buyer and seller roles
    - Validates role switching permissions
    - Updates user session role
    """
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = CustomUserDetailsSerializer
    allowed_roles = ['buyer', 'seller']
    throttle_scope = 'switch_role'
    
    def post(self, request):
        """Handle role switching with validation"""
        user = request.user
        new_role = request.data.get('role')
        
        if new_role not in self.allowed_roles:
            return Response(
                {'error': f'Invalid role. Allowed: {", ".join(self.allowed_roles)}'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if new_role == 'seller' and not user.is_seller:
            return Response(
                {'error': 'Complete seller registration first'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Prevent unnecessary updates
        if user.current_role == new_role:
            serializer = self.get_serializer(user, context={'request': request})
            return Response({
                'warning': f'Already in {new_role} role',
                'user': serializer.data
            }, status=status.HTTP_200_OK)
        
        user.current_role = new_role
        user.save()
        
        serializer = self.get_serializer(user, context={'request': request})
        return Response({
            'status': 'success',
            'message': f'Role switched to {new_role}',
            'user': serializer.data
        })


# ==========================
# Profile Completion Check View
# ==========================

class ProfileCompletionCheckView(generics.GenericAPIView):
    """
    View for checking seller profile completion status.
    
    This view:
    - Checks if all required profile fields are filled
    - Identifies missing required fields
    - Returns profile completion status
    """
    permission_classes = [permissions.IsAuthenticated, IsSeller]
    serializer_class = SellerProfileSetupSerializer
    throttle_scope = 'profile_check'
    
    @method_decorator(cache_page(60 * 5))  # Cache for 5 minutes
    @method_decorator(vary_on_cookie)
    def get(self, request):
        """Check profile completion status"""
        user = request.user
        if not user.is_seller:
            raise PermissionDenied("Only sellers can check profile completion")
        
        profile = get_object_or_404(SellerProfile, user=user)
        serializer = self.get_serializer(profile)
        
        return Response({
            'is_complete': profile.is_profile_complete,
            'missing_fields': self._get_missing_fields(profile),
            'profile': serializer.data
        })
    
    def _get_missing_fields(self, profile):
        """Identify which required fields are missing"""
        missing = []
        
        if not profile.profile_title:
            missing.append('profile_title')
        if not profile.bio:
            missing.append('bio')
        if not profile.educations.exists():
            missing.append('educations')
        if not profile.skills.exists():
            missing.append('skills')
        if not profile.languages.exists():
            missing.append('languages')
        if not profile.portfolio_items.exists():
            missing.append('portfolio_items')
            
        return missing

class CustomEmailVerificationView(APIView):
    """
    Custom view to handle email verification separately from registration.
    This allows for a two-step registration process where email is verified
    before completing the user profile setup.
    """
    permission_classes = [permissions.AllowAny]
    throttle_scope = 'email_verification'

    def post(self, request, *args, **kwargs):
        """
        Handle email verification request.
        Expects email in request data.
        """
        email = request.data.get('email')
        if not email:
            return Response(
                {'error': 'Email is required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            # Check if email already exists
            if User.objects.filter(email=email).exists():
                return Response(
                    {'error': 'Email is already registered'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Create a temporary user for email verification
            temp_user = User.objects.create(
                username=f"temp_{email.split('@')[0]}",
                email=email,
                is_active=False,  # User won't be active until profile is complete
                is_email_verified=False
            )
            temp_user.set_unusable_password()  # Set unusable password until profile is complete
            temp_user.save()

            # Create email address and send verification
            email_address = EmailAddress.objects.create(
                user=temp_user,
                email=email,
                primary=True,
                verified=False
            )

            # Send verification email
            complete_signup(
                request._request,
                temp_user,
                allauth_settings.EMAIL_VERIFICATION,
                None,  # No success URL needed as we'll handle it in frontend
            )

            return Response({
                'message': 'Verification email sent',
                'email': email
            }, status=status.HTTP_200_OK)

        except Exception as e:
            # Clean up if anything goes wrong
            if 'temp_user' in locals():
                temp_user.delete()
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

class CustomRegisterView(RegisterView):
    """
    Custom registration view that handles the second step of registration
    after email verification.
    """
    serializer_class = BasicRegisterSerializer
    permission_classes = [permissions.AllowAny]
    throttle_scope = 'register'

    def post(self, request, *args, **kwargs):
        """
        Handle the second step of registration after email verification.
        Expects email, username, password, and other user details.
        """
        email = request.data.get('email')
        if not email:
            return Response(
                {'error': 'Email is required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            # Find the temporary user created during email verification
            temp_user = User.objects.get(
                email=email,
                is_active=False,
                is_email_verified=True
            )

            # Update the serializer context with the temporary user
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            
            # Update the temporary user with the new data
            user = serializer.save(request)
            
            # Delete the temporary user as we've created the real one
            temp_user.delete()

            # Generate tokens
            refresh = RefreshToken.for_user(user)
            
            return Response({
                'user': serializer.data,
                'access': str(refresh.access_token),
                'refresh': str(refresh)
            }, status=status.HTTP_201_CREATED)

        except User.DoesNotExist:
            return Response(
                {'error': 'Email not verified or verification expired'},
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )