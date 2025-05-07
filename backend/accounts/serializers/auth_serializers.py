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
class BasicRegisterSerializer(RegisterSerializer):
    # Remove all fields except email and passwords
    first_name = None
    last_name = None
    username = None
    
    def validate_password1(self, password):
        validate_password(password)
        return password

    def get_cleaned_data(self):
        return {
            'email': self.validated_data.get('email', ''),
            'password1': self.validated_data.get('password1', ''),
        }

# ===================
# Custom UserDetails
# ===================
class CustomUserDetailsSerializer(UserDetailsSerializer):
    profile_id = serializers.IntegerField(source='profile.id', read_only=True)
    is_buyer = serializers.BooleanField(read_only=True)
    is_seller = serializers.BooleanField(read_only=True)
    # current_role = serializers.CharField(read_only=True)
    # profile_complete = serializers.BooleanField(source='profile.profile_complete', read_only=True)

    class Meta(UserDetailsSerializer.Meta):
        fields = UserDetailsSerializer.Meta.fields + (
            'profile_id', 'is_buyer', 'is_seller', 
            'current_role'
        )
        
    def get_profile_id(self, obj):
        return obj.profile.id if hasattr(obj, 'profile') else None
    
    def update(self, instance, validated_data):
        instance.first_name = validated_data.get('first_name')
        instance.last_name = validated_data.get('last_name')
        instance.is_buyer = validated_data.get('is_buyer', True)
        instance.is_seller = validated_data.get('is_seller', False)
        instance.current_role = 'buyer' if instance.is_buyer else 'seller'
        instance.save()
        
        # Create profile if it doesn't exist
        if not hasattr(instance, 'userprofile'):
            UserProfile.objects.create(user=instance)
            
        return instance