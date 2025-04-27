from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),

    # Authentication APIs (for API-based login/registration)
    path('api/auth/', include('dj_rest_auth.urls')),
    path('api/auth/registration/', include('dj_rest_auth.registration.urls')),

    # Include account URLs for frontend rendering
    path('account/', include('accounts.urls')),  # Account views (login, register)

    # Your app URLs
    path('api/core/', include('core.urls')),
    path('api/gigs/', include('gigs.urls')),
    path('api/orders/', include('orders.urls')),
    path('api/payments/', include('payments.urls')),
]

# Serve media files during development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
