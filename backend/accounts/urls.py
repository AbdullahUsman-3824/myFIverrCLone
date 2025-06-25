from django.urls import path
from .views import (
    SellerProfileSetupView,
    SellerProfileDetailView,
    SellerProfileDeleteView,
    BecomeSellerView,
    SwitchRoleView,
    ProfileCompletionCheckView,
    PublicSellerProfileBySellerIdView, 
    PublicSellerProfileByUsernameView
)

urlpatterns = [
    # Seller profile setup (GET for retrieve, PATCH/PUT for update)
    path('seller/profile/setup/', SellerProfileSetupView.as_view(), name='seller-profile-setup'),

    # Seller profile details (public read access)
    path('seller/profile/detail/', SellerProfileDetailView.as_view(), name='seller-profile-detail'),
    path("seller/profile/id/<int:seller_id>/", PublicSellerProfileBySellerIdView.as_view(), name="public-seller-by-seller-id"),
    path("seller/username/<str:username>/", PublicSellerProfileByUsernameView.as_view(), name="public-seller-by-username"),

    # Delete seller profile
    path('seller/profile/delete/', SellerProfileDeleteView.as_view(), name='seller-profile-delete'),

    # Become a seller
    path('seller/become/', BecomeSellerView.as_view(), name='become-seller'),

    # Switch role between buyer and seller
    path('user/switch-role/', SwitchRoleView.as_view(), name='switch-role'),

    # Check profile completion status
    path('seller/profile/check-completion/', ProfileCompletionCheckView.as_view(), name='profile-completion-check'),
]
