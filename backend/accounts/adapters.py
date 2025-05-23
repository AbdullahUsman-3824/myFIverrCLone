from allauth.account.adapter import DefaultAccountAdapter
from django.conf import settings

class CustomAccountAdapter(DefaultAccountAdapter):
    def send_mail(self, template_prefix, email, context, **kwargs):
        frontend_url = getattr(settings, 'FRONTEND_URL', 'http://localhost:5173')
        
        if 'password_reset_url' in context:
            original_url = context.get('password_reset_url', '')
            token_part = original_url.split('reset/')[1] 
            
            context['password_reset_url'] = f"{frontend_url}/reset-password/{token_part}"
        
        if 'activate_url' and 'key' in context:
            key = context.get('key', '')
            
            context['activate_url'] = f"{frontend_url}/verify-email?key={ key }"
         
        # Add your custom variables
        context.update({
            'SITE_NAME': getattr(settings, 'SITE_NAME', 'Workerr'),
            'SITE_DOMAIN': getattr(settings, 'SITE_DOMAIN', 'workerr.com'),
        })
        return super().send_mail(template_prefix, email, context, **kwargs)