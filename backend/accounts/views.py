from rest_framework import generics, permissions, status, mixins
from rest_framework.exceptions import PermissionDenied, NotFound
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404
from django.db import transaction
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from django.views.decorators.vary import vary_on_cookie

from .models import SellerProfile
from .serializers.profile_serializers import SellerProfileSerializer
from .serializers.auth_serializers import CustomUserDetailsSerializer
from .permissions import IsSeller, IsSellerProfileOwner

User = get_user_model()

# ==========================
# Base Profile View Classes
# ==========================

class BaseSellerProfileView:
    permission_classes = [permissions.IsAuthenticated, IsSeller]

    def get_profile(self, user):
        if not user.is_seller:
            raise PermissionDenied("Only sellers can access this.")
        return get_object_or_404(SellerProfile, user=user)


# ==========================
# Seller Profile Setup View
# ==========================

class SellerProfileSetupView(
    BaseSellerProfileView,
    mixins.UpdateModelMixin,
    generics.GenericAPIView
):
    serializer_class = SellerProfileSerializer
    permission_classes = [permissions.IsAuthenticated, IsSeller, IsSellerProfileOwner]

    def get_object(self):
        return self.get_profile(self.request.user)

    @method_decorator(cache_page(60 * 15))
    @method_decorator(vary_on_cookie)
    def get(self, request, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)

    def patch(self, request, *args, **kwargs):
        return self.partial_update(request, *args, **kwargs)

    def put(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)


# ==========================
# Seller Profile Detail View
# ==========================

class SellerProfileDetailView(
    BaseSellerProfileView,
    generics.RetrieveAPIView
):
    serializer_class = SellerProfileSerializer
    permission_classes = [permissions.AllowAny]

    def get_object(self):
        user_id = self.kwargs.get("user_id")
        return get_object_or_404(SellerProfile, user__id=user_id)

    def get_serializer_context(self):
        return {'request': self.request}


# ==========================
# Seller Profile Delete View
# ==========================

class SellerProfileDeleteView(
    BaseSellerProfileView,
    generics.DestroyAPIView
):
    serializer_class = SellerProfileSerializer
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
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = CustomUserDetailsSerializer
    throttle_scope = 'become_seller'

    @transaction.atomic
    def post(self, request):
        user = request.user

        if user.is_seller:
            return Response(
                {'error': 'User is already a seller'},
                status=status.HTTP_400_BAD_REQUEST
            )

        user.is_seller = True
        user.current_role = 'seller'
        user.save()

        SellerProfile.objects.get_or_create(
            user=user,
            defaults={'is_profile_complete': False}
        )

        serializer = self.get_serializer(user, context={'request': request})
        return Response({
            'status': 'success',
            'message': 'You are now a seller',
            'user': serializer.data,
        })


# ==========================
# Switch Role View
# ==========================

class SwitchRoleView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = CustomUserDetailsSerializer
    allowed_roles = ['buyer', 'seller']
    throttle_scope = 'switch_role'

    def post(self, request):
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
    permission_classes = [permissions.IsAuthenticated, IsSeller]
    serializer_class = SellerProfileSerializer
    throttle_scope = 'profile_check'

    @method_decorator(cache_page(60 * 5))
    @method_decorator(vary_on_cookie)
    def get(self, request):
        user = request.user

        profile = get_object_or_404(SellerProfile, user=user)
        serializer = self.get_serializer(profile)

        return Response({
            'is_complete': profile.is_profile_complete,
            'missing_fields': self._get_missing_fields(profile),
            'profile': serializer.data
        })

    def _get_missing_fields(self, profile):
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
