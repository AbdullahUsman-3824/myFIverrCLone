from rest_framework import generics, permissions, status, mixins
from rest_framework.exceptions import PermissionDenied, NotFound
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from django.views.decorators.vary import vary_on_cookie
from allauth.account.models import EmailConfirmation, EmailConfirmationHMAC

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
    serializer_class = SellerProfileSetupSerializer
    permission_classes = [permissions.IsAuthenticated, IsSeller, IsSellerProfileOwner]
    
    def get_object(self):
        return self.get_profile(self.request.user)
    
    @method_decorator(cache_page(60 * 15))  # Cache for 15 minutes
    @method_decorator(vary_on_cookie)
    def get(self, request, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)
    
    def patch(self, request, *args, **kwargs):
        return self.partial_update(request, *args, **kwargs)
    
    def put(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)



# ==========================
# Seller Profile Detail View (Read)
# ==========================

class SellerProfileDetailView(
    BaseSellerProfileView,
    generics.RetrieveAPIView
):
    serializer_class = SellerProfileSetupSerializer
    permission_classes = [permissions.AllowAny]
    
    def get_object(self):
        return self.get_profile(self.request.user)
    
    def get_serializer_context(self):
        return {'request': self.request}

# ==========================
# Seller Profile Delete View
# ==========================

class SellerProfileDeleteView(
    BaseSellerProfileView,
    generics.DestroyAPIView
):
    serializer_class = SellerProfileSetupSerializer
    permission_classes = [permissions.IsAuthenticated, IsSeller, IsSellerProfileOwner]
    
    def get_object(self):
        return self.get_profile(self.request.user)
    
    def perform_destroy(self, instance):
        user = instance.user
        user.is_seller = False
        if user.current_role == 'seller':
            user.current_role = 'buyer'
        user.save()
        instance.delete()
    
    def delete(self, request, *args, **kwargs):
        self.destroy(request, *args, **kwargs)
        return Response(
            {"detail": "Seller profile successfully deleted."},
            status=status.HTTP_204_NO_CONTENT
        )

# ==========================
# Become Seller View
# ==========================

class BecomeSellerView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated, IsVerifiedUser ]
    serializer_class = CustomUserDetailsSerializer
    throttle_scope = 'become_seller'
    
    def post(self, request):
        user = request.user
        
        if user.is_seller:
            return Response(
                {'error': 'User  is already a seller'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        user.is_seller = True
        user.current_role = 'seller'
        user.save()
        
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