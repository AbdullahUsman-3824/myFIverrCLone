from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),

    # Your app urls (we will add later when apps are ready)
    path('api/accounts/', include('accounts.urls')),
    path('api/core/', include('core.urls')),
    path('api/gigs/', include('gigs.urls')),
    path('api/messages/', include('messages.urls')),
    path('api/orders/', include('orders.urls')),
    path('api/reviews/', include('reviews.urls')),
]

# Serve media files during development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
