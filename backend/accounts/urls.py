from django.urls import path
from .views import *

urlpatterns = [
    # Buyer profile setup
    path('profile/buyer-setup/', BuyerProfileSetupView.as_view(), name='buyer_profile_setup'),

    # Seller profile setup
    path('profile/seller-setup/', SellerProfileSetupView.as_view(), name='seller_profile_setup'),

    # Optional: View full profile (combined info)
    path('profile/complete/', CompleteProfileView.as_view(), name='complete_profile'),

    # Role upgrade and switching
    path('user/become-seller/', BecomeSellerView.as_view(), name='become_seller'),
    path('user/switch-role/', SwitchRoleView.as_view(), name='switch_role'),
]
