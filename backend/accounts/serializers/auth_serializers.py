from dj_rest_auth.registration.serializers import RegisterSerializer
from dj_rest_auth.serializers import LoginSerializer, UserDetailsSerializer
from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _
from django.core.validators import validate_email
from django.contrib.auth import authenticate

User = get_user_model()

# ================
# Custom Register
# ================
class BasicRegisterSerializer(RegisterSerializer):
    username = None  
    email = serializers.EmailField(required=True)
    
    def get_cleaned_data(self):
        email = self.validated_data.get('email', '').lower()
        base_username = email.split('@')[0]
        username = base_username
        counter = 1
        
        while User.objects.filter(username=username).exists():
            username = f"{base_username}{counter}"
            counter += 1
            
        return {
            'username': username,  # Auto-generated
            'password1': self.validated_data.get('password1'),
            'password2': self.validated_data.get('password2'),
            'email': email,
        }
    
    def validate(self, data):
        if 'username' in data:
            del data['username']
        return super().validate(data)

# ================
# Custom Login
# ================
class FlexibleLoginSerializer(serializers.Serializer):
    login_identifier = serializers.CharField(required=True)
    password = serializers.CharField(required=True, trim_whitespace=False)

    def validate(self, attrs):
        identifier = attrs.get('login_identifier')
        password = attrs.get('password')

        if not identifier or not password:
            raise serializers.ValidationError("Both login_identifier and password are required.")

        if '@' in identifier:
            try:
                validate_email(identifier)
                user = authenticate(self.context['request'], email=identifier.lower(), password=password)
            except:
                raise serializers.ValidationError("Invalid email format.")
        else:
            user = authenticate(self.context['request'], username=identifier, password=password)

        if not user:
            raise serializers.ValidationError("Invalid credentials.")

        if not user.is_active:
            raise serializers.ValidationError("User account is disabled.")

        attrs['user'] = user
        return attrs

# ===================
# Custom UserDetails
# ===================
class CustomUserDetailsSerializer(UserDetailsSerializer):
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
            'is_email_verified',
            'email',
        )
    
    def update(self, instance, validated_data):
        if 'username' in validated_data and validated_data['username'] == instance.username:
            validated_data.pop('username')

        instance = super().update(instance, validated_data)
        
        required_fields = [
            bool(instance.first_name and instance.first_name.strip()),
            bool(instance.last_name and instance.last_name.strip()),
            bool(instance.profile_picture),
            bool(instance.email and instance.email.strip())
        ]

        is_profile_set = all(required_fields)

        if instance.is_profile_set != is_profile_set:
            instance.is_profile_set = is_profile_set
            instance.save(update_fields=['is_profile_set'])

        return instance