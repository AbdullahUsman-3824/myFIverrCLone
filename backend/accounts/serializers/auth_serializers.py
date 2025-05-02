from dj_rest_auth.registration.serializers import RegisterSerializer
from dj_rest_auth.serializers import LoginSerializer, UserDetailsSerializer
from rest_framework import serializers
from django.contrib.auth import get_user_model
from ..models import UserProfile
from django.contrib.auth.password_validation import validate_password

User = get_user_model()

# ================
# Custom Login
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
                {"email": "No account exists with this email address."}
            )

# ================
# Custom Register
# ================
class CustomRegisterSerializer(RegisterSerializer):
    first_name = serializers.CharField(required=True)
    last_name = serializers.CharField(required=True)
    is_buyer = serializers.BooleanField(default=True)
    is_seller = serializers.BooleanField(default=False)

    class Meta:
        model = User
        fields = (
            'email', 'username', 'password1', 'password2',
            'first_name', 'last_name', 'is_buyer', 'is_seller',
        )

    def validate_password1(self, value):
        validate_password(value)
        return value

    def get_cleaned_data(self):
        data = super().get_cleaned_data()
        data['first_name'] = self.validated_data.get('first_name', '')
        data['last_name'] = self.validated_data.get('last_name', '')
        data['is_buyer'] = self.validated_data.get('is_buyer', True)
        data['is_seller'] = self.validated_data.get('is_seller', False)
        return data

    def save(self, request):
        user = super().save(request)
        user.first_name = self.cleaned_data.get('first_name')
        user.last_name = self.cleaned_data.get('last_name')
        user.is_buyer = self.cleaned_data.get('is_buyer')
        user.is_seller = self.cleaned_data.get('is_seller')
        user.current_role = 'buyer' if user.is_buyer else 'seller'
        user.save()

        # Create empty profile
        UserProfile.objects.create(user=user)
        return user


# ===================
# Custom UserDetails
# ===================
class CustomUserDetailsSerializer(UserDetailsSerializer):
    profile_id = serializers.IntegerField(source='profile.id', read_only=True)
    is_buyer = serializers.BooleanField(read_only=True)
    is_seller = serializers.BooleanField(read_only=True)
    current_role = serializers.CharField(read_only=True)
    profile_complete = serializers.BooleanField(source='profile.profile_complete', read_only=True)

    class Meta(UserDetailsSerializer.Meta):
        fields = UserDetailsSerializer.Meta.fields + (
            'profile_id', 'is_buyer', 'is_seller', 
            'current_role', 'profile_complete'
        )
        
    def get_profile_id(self, obj):
        return obj.profile.id if hasattr(obj, 'profile') else None
