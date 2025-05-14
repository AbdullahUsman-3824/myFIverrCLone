from dj_rest_auth.registration.serializers import RegisterSerializer
from dj_rest_auth.serializers import LoginSerializer, UserDetailsSerializer
from rest_framework import serializers
from django.contrib.auth import get_user_model
from ..models import SellerProfile
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _

User = get_user_model()

# Note: Using dj-rest-auth's built-in validation for most fields

# ================
# Custom Login  (not used)
# ================
class CustomLoginSerializer(LoginSerializer):
    email = serializers.EmailField(required=False)
    
    def validate(self, attrs):
        try:
            if attrs.get('email'):
                user = User.objects.get(email=attrs['email'])
                attrs['username'] = user.username
            return super().validate(attrs)
        except User.DoesNotExist:
            raise serializers.ValidationError(
                {"email": _("No account exists with this email address.")}
            )

# ================
# Custom Register
# ================
class BasicRegisterSerializer(RegisterSerializer):
    username = serializers.CharField(required=True)
    first_name = serializers.CharField(required=False, allow_blank=True, max_length=150)
    last_name = serializers.CharField(required=False, allow_blank=True, max_length=150)
    profile_picture = serializers.ImageField(required=False)

    def get_cleaned_data(self):
        return {
            'username': self.validated_data.get('username', ''),
            'password1': self.validated_data.get('password1', ''),
            'email': self.validated_data.get('email', ''),
            'first_name': self.validated_data.get('first_name', ''),
            'last_name': self.validated_data.get('last_name', ''),
            'profile_picture': self.validated_data.get('profile_picture', None),
        }
        
    def save(self, request):
        user = super().save(request)
        
        # Set additional fields from cleaned_data
        user.first_name = self.cleaned_data.get('first_name', '')
        user.last_name = self.cleaned_data.get('last_name', '')
        
        # Handle profile picture if provided
        profile_picture = self.cleaned_data.get('profile_picture')
        if profile_picture:
            user.profile_picture = profile_picture
            
        user.save()
        
        # Create empty seller profile for future use
        SellerProfile.objects.get_or_create(user=user)
        
        return user

# ===================
# Custom UserDetails
# ===================
class CustomUserDetailsSerializer(UserDetailsSerializer):
    email = serializers.EmailField(required=False) 
    
    class Meta(UserDetailsSerializer.Meta):
        model = User
        fields = UserDetailsSerializer.Meta.fields + (
            'is_seller',
            'current_role',
            'profile_picture',
            'is_email_verified',
            'is_profile_set',
            'date_joined',
        )
        read_only_fields = (
            'is_profile_set',
            'date_joined',
            'is_email_verified',
        )
    
    def validate_email(self, value):
        """Validate that the email isn't already in use by another user"""
        user = self.context['request'].user
        if User.objects.exclude(pk=user.pk).filter(email=value).exists():
            raise serializers.ValidationError(_("This email is already in use."))
        return value
    
    def update(self, instance, validated_data):
        # Check if email has changed
        new_email = validated_data.get('email')
        email_changed = new_email and new_email != instance.email
        
        # Store the old email for verification logic
        old_email = instance.email if email_changed else None
        
        # Update all other fields first
        result = super().update(instance, validated_data)
        
        # Handle email change
        if email_changed:
            # Mark email as unverified
            instance.is_email_verified = False
            instance.save(update_fields=['is_email_verified'])
        
        # Check profile completeness
        is_profile_set = bool(
            instance.first_name and
            instance.last_name and
            instance.profile_picture and
            instance.email
        )
        
        instance.is_profile_set = is_profile_set
        instance.save(update_fields=['is_profile_set'])
        
        return result
    