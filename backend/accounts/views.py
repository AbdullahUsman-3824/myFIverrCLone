from rest_framework import generics, permissions, status, mixins
from rest_framework.exceptions import PermissionDenied, NotFound
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
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

from django.utils import timezone
from django.db.models import Sum
from orders.models import Order
from gigs.models import Gig

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
        return get_object_or_404(SellerProfile, user=self.request.user)

    def get_serializer_context(self):
        return {'request': self.request}
    
class PublicSellerProfileBySellerIdView(generics.RetrieveAPIView):
    serializer_class = SellerProfileSerializer
    permission_classes = [permissions.AllowAny]

    def get_object(self):
        seller_id = self.kwargs.get('seller_id')
        return get_object_or_404(SellerProfile.objects.select_related('user'), id=seller_id, user__is_seller=True)

    def get_serializer_context(self):
        return {'request': self.request}
    
class PublicSellerProfileByUsernameView(generics.RetrieveAPIView):
    serializer_class = SellerProfileSerializer
    permission_classes = [permissions.AllowAny]

    def get_object(self):
        username = self.kwargs.get('username')
        user = get_object_or_404(User, username=username, is_seller=True)
        return get_object_or_404(SellerProfile, user=user)

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

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def seller_dashboard(request):
    user = request.user

    try:
        seller_profile = SellerProfile.objects.get(user=user)
    except SellerProfile.DoesNotExist:
        return Response({"detail": "Seller profile not found."}, status=404)

    gigs_count = Gig.objects.filter(seller=seller_profile).count()
    orders_count = Order.objects.filter(gig__seller=seller_profile, status="in_progress").count()

    today = timezone.now().date()
    start_of_month = today.replace(day=1)

    # daily_revenue = (
    #     Order.objects.filter(gig__seller=user, status="completed", completed_at__date=today)
    #     .aggregate(Sum("price"))["price__sum"] or 0
    # )

    # monthly_revenue = (
    #     Order.objects.filter(gig__seller=user, status="completed", completed_at__date__gte=start_of_month)
    #     .aggregate(Sum("price"))["price__sum"] or 0
    # )

    # total_revenue = (
    #     Order.objects.filter(gig__seller=user, status="completed")
    #     .aggregate(Sum("price"))["price__sum"] or 0
    # )

    return Response({
        "gigs": gigs_count,
        "orders": orders_count,
        "unreadMessages": 0,
        "dailyRevenue": 0,
        "monthlyRevenue": 0,
        "revenue": 0,
    })
