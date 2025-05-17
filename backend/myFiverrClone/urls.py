from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView, SpectacularRedocView
from accounts.views import CustomEmailVerificationView, CustomRegisterView

urlpatterns = [
    path('admin/', admin.site.urls),
    
    path('api/auth/', include('dj_rest_auth.urls')),  # Other auth endpoints (login, logout, etc.)
    path('api/auth/registration/', include('dj_rest_auth.registration.urls')),

    # Include account URLs for frontend rendering
    path('api/accounts/', include('accounts.urls')),  # Account views (profile, role management, etc.)

    # Your app URLs
    path('api/core/', include('core.urls')),
    path('api/gigs/', include('gigs.urls')),
    path('api/orders/', include('orders.urls')),
    path('api/payments/', include('payments.urls')),
    
    path('schema/', SpectacularAPIView.as_view(), name='schema'),
    path('swagger/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
]

# Serve media files during development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
