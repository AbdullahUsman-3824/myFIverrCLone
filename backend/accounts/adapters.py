from allauth.account.adapter import DefaultAccountAdapter
from allauth.account.utils import user_email
from django.conf import settings
from django.contrib.auth import get_user_model

User = get_user_model()

class CustomAccountAdapter(DefaultAccountAdapter):
    def is_open_for_signup(self, request):
        """
        Whether to allow sign ups.
        """
        return getattr(settings, 'ACCOUNT_ALLOW_REGISTRATION', True)

    def save_user(self, request, user, form, commit=True):
        """
        Saves a new `User` instance using information provided in the signup form.
        """
        user = super().save_user(request, user, form, commit=False)
        user.is_email_verified = False  # Set to False initially
        if commit:
            user.save()
        return user

    def confirm_email(self, request, email_address):
        """
        Marks the email address as confirmed and updates the user's is_email_verified field.
        """
        email_address.verified = True
        email_address.set_as_primary(conditional=True)
        email_address.save()
        
        # Update the user's is_email_verified field
        user = email_address.user
        user.is_email_verified = True
        
        # If this is a temporary user (has unusable password), keep it inactive
        # Otherwise, activate the user
        if not user.has_usable_password():
            user.is_active = False
        else:
            user.is_active = True
            
        user.save(update_fields=['is_email_verified', 'is_active'])
        
        return email_address

    def is_email_verified(self, request, email_address):
        """
        Override to handle temporary users during email verification.
        """
        if not email_address.verified:
            return False
            
        user = email_address.user
        if not user.has_usable_password():
            # This is a temporary user, only consider email verified
            return True
            
        return user.is_email_verified 