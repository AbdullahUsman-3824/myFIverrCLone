from rest_framework import generics, permissions, status
from rest_framework.exceptions import PermissionDenied
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth import get_user_model

from .models import *
from .serializers.profile_serializers import *
from .serializers.auth_serializers import *

User = get_user_model()

# ==========================
# Buyer Profile Setup View
# ==========================

class BuyerProfileSetupView(generics.UpdateAPIView):
    serializer_class = BuyerProfileSetupSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user.profile

# ==========================
# Seller Profile Setup View
# ==========================

class SellerProfileSetupView(generics.UpdateAPIView):
    serializer_class = SellerProfileSetupSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        user = self.request.user
        if not user.is_seller:
            raise PermissionDenied("Only sellers can access this.")
        return user.profile

# ========================
# Become Seller View
# ========================

class BecomeSellerView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        user = request.user
        user.is_seller = True
        user.current_role = 'seller'
        user.save()

        profile = user.profile
        profile.save()

        return Response({
            'status': 'success',
            'message': 'You are now a seller',
            'user': CustomUserDetailsSerializer(user, context={'request': request}).data
        })

# ========================
# Switch Role View
# ========================

class SwitchRoleView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        user = request.user
        new_role = request.data.get('role')

        if new_role not in ['buyer', 'seller']:
            return Response({'error': 'Invalid role'}, status=status.HTTP_400_BAD_REQUEST)

        if new_role == 'seller' and not user.is_seller:
            return Response({'error': 'User is not a seller'}, status=status.HTTP_403_FORBIDDEN)

        user.current_role = new_role
        user.save()

        return Response({
            'status': 'success',
            'message': f'Role switched to {new_role}',
            'user': CustomUserDetailsSerializer(user, context={'request': request}).data
        })

# ================================================
# Read-only view for complete profile (optional)
# ================================================

class CompleteProfileView(generics.RetrieveAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = CompleteProfileSerializer  # could be a combined serializer

    def get_object(self):
        return self.request.user.profile


# ========================
def createDummyUser():
    # This function creates a dummy user for testing purposes
    user = UserProfile.objects.create_user(username='testuser', email='test@example.com', password='password')
    user.is_buyer = True
    user.is_seller = False
    user.save()
