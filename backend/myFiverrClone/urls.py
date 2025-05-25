from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView, SpectacularRedocView
from dj_rest_auth.registration.views import SocialLoginView
from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from allauth.socialaccount.providers.oauth2.client import OAuth2Client
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator

@method_decorator(csrf_exempt, name='dispatch')
class GoogleLogin(SocialLoginView):
    adapter_class = GoogleOAuth2Adapter
    client_class = OAuth2Client
    callback_url = "http://localhost:5173/"  # Frontend URL

# Define URL patterns
urlpatterns = [
    # Admin interface
    path('admin/', admin.site.urls),

    # Authentication and registration
    path('api/auth/', include('dj_rest_auth.urls')),
    path('api/auth/registration/', include('dj_rest_auth.registration.urls')),
    path('accounts/', include('django.contrib.auth.urls')),
    
    # Social authentication endpoints
    path('accounts/', include('allauth.urls')),  
    path('api/auth/google/', GoogleLogin.as_view(), name='google_login'),
    
    # Core application URLs
    path('api/core/', include('core.urls')),
    path('api/accounts/', include('accounts.urls')),
    path('api/gigs/', include('gigs.urls')),
    path('api/orders/', include('orders.urls')),
    path('api/payments/', include('payments.urls')),

    # API documentation
    path('schema/', SpectacularAPIView.as_view(), name='schema'),
    path('swagger/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
]

# Serve media files during development
if settings.DEBUG:
    # Append media URL patterns to the main URL configuration
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)