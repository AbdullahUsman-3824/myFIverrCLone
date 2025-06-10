from django.urls import path
from .views import (
    SellerProfileSetupView,
    SellerProfileDetailView,
    SellerProfileDeleteView,
    BecomeSellerView,
    SwitchRoleView,
    ProfileCompletionCheckView
)

urlpatterns = [
    # Seller profile setup (GET for retrieve, PATCH/PUT for update)
    path('seller/profile/setup/', SellerProfileSetupView.as_view(), name='seller-profile-setup'),

    # Seller profile details (public read access)
    path('seller/profile/detail/', SellerProfileDetailView.as_view(), name='seller-profile-detail'),

    # Delete seller profile
    path('seller/profile/delete/', SellerProfileDeleteView.as_view(), name='seller-profile-delete'),

    # Become a seller
    path('seller/become/', BecomeSellerView.as_view(), name='become-seller'),

    # Switch role between buyer and seller
    path('user/switch-role/', SwitchRoleView.as_view(), name='switch-role'),

    # Check profile completion status
    path('seller/profile/check-completion/', ProfileCompletionCheckView.as_view(), name='profile-completion-check'),
]
