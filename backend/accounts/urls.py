from django.urls import path
from .views import (
    SellerProfileSetupView,
    SellerProfileDetailView,
    SellerProfileDeleteView,
    BecomeSellerView,
    SwitchRoleView,
    ProfileCompletionCheckView,
)

urlpatterns = [
    # Seller Profile CRUD Endpoints
    path('seller/profile/', SellerProfileDetailView.as_view(), name='seller-profile-detail'),
    path('seller/profile/setup/', SellerProfileSetupView.as_view(), name='seller-profile-setup'),
    path('seller/profile/delete/', SellerProfileDeleteView.as_view(), name='seller-profile-delete'),
    
    # Role Management Endpoints
    path('become-seller/', BecomeSellerView.as_view(), name='become-seller'),
    path('switch-role/', SwitchRoleView.as_view(), name='switch-role'),
    
    # Profile Status Endpoint
    path('seller/profile/completion/', ProfileCompletionCheckView.as_view(), name='profile-completion-check'),
]