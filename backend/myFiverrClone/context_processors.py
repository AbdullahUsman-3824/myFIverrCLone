from django.conf import settings

def site_settings(request):
    frontend_url = getattr(settings, 'FRONTEND_URL', 'http://localhost:5173')
    site_name = getattr(settings, 'SITE_NAME', 'Workerr')
    
    return {
        'FRONTEND_URL': frontend_url,
        'ACCOUNT_EMAIL_CONFIRMATION_URL': f"{frontend_url}/verify-email",
        'SITE_NAME': site_name,
    }