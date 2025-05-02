from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from django.contrib.auth import get_user_model
from ..models import UserProfile, PortfolioItem, Education, Skill, Language
from ..serializers.auth_serializers import CustomUserDetailsSerializer

User = get_user_model()

# ===========================
# Buyer Profile Serializers
# ===========================

# --- Nested Language Serializer ---
class LanguageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Language
        fields = ['id', 'name', 'level']
        extra_kwargs = {'profile': {'read_only': True}}

# --- Buyer Profile Setup ---
class BuyerProfileSetupSerializer(serializers.ModelSerializer):
    first_name = serializers.CharField(source='user.first_name', required=True)
    last_name = serializers.CharField(source='user.last_name', required=True)
    username = serializers.CharField(
        source='user.username',
        required=True,
    )
    languages = LanguageSerializer(many=True)
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Add UniqueValidator AFTER initialization, excluding current user
        if self.instance:  # Only for updates (not creation)
            self.fields['username'].validators.append(
                UniqueValidator(
                    queryset=User.objects.exclude(pk=self.instance.user.pk),
                    message="This username is already taken by another user."
                )
            )

    class Meta:
        model = UserProfile
        fields = ['first_name', 'last_name', 'username', 'profile_picture', 'bio', 'location', 'languages']
        extra_kwargs = {
            'bio': {'required': False},
            'location': {'required': False},
            'profile_picture': {'required': False},
        }

    def update(self, instance, validated_data):
        user_data = validated_data.pop('user', {})
        languages_data = validated_data.pop('languages', [])

        # Update User model
        for attr, value in user_data.items():
            setattr(instance.user, attr, value)
        instance.user.save()

        # Update profile fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        # Replace languages
        instance.languages.all().delete()
        for lang in languages_data:
            Language.objects.create(profile=instance, **lang)

        return instance

# ===========================
# Seller Profile Serializers
# ===========================

class EducationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Education
        fields = ['id', 'institution_name', 'degree_title', 'start_year', 'end_year']
        extra_kwargs = {'profile': {'read_only': True}}

class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = ['id', 'name', 'level']
        extra_kwargs = {'profile': {'read_only': True}}

class PortfolioItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = PortfolioItem
        fields = ['id', 'title', 'description', 'url_link', 'media_file']
        extra_kwargs = {
            'profile': {'read_only': True},
            'media_file': {'required': False}
        }

class SellerProfileSetupSerializer(serializers.ModelSerializer):
    educations = EducationSerializer(many=True)
    skills = SkillSerializer(many=True)
    portfolio_items = PortfolioItemSerializer(many=True)

    class Meta:
        model = UserProfile
        fields = ['portfolio_link', 'educations', 'skills', 'portfolio_items']
        extra_kwargs = {
            'portfolio_link': {'required': False}
        }

    def update(self, instance, validated_data):
        educations_data = validated_data.pop('educations', [])
        skills_data = validated_data.pop('skills', [])
        portfolio_data = validated_data.pop('portfolio_items', [])

        # Update User model 
        instance.user.is_seller = True
        instance.user.current_role = 'seller'
        instance.user.save() 
        
        # Update profile field
        instance.portfolio_link = validated_data.get('portfolio_link', instance.portfolio_link)
        instance.save()

        # Replace education, skills, portfolio
        instance.educations.all().delete()
        instance.skills.all().delete()
        instance.portfolio_items.all().delete()

        for edu in educations_data:
            Education.objects.create(profile=instance, **edu)
        for skill in skills_data:
            Skill.objects.create(profile=instance, **skill)
        for item in portfolio_data:
            PortfolioItem.objects.create(profile=instance, **item)

        return instance

# ============================
# Complete Profile Serializer
# ============================

class CompleteProfileSerializer(serializers.ModelSerializer):
    user = CustomUserDetailsSerializer(read_only=True)
    educations = EducationSerializer(many=True)
    skills = SkillSerializer(many=True)
    languages = LanguageSerializer(many=True)
    portfolio_items = PortfolioItemSerializer(many=True)
    profile_picture_url = serializers.SerializerMethodField()

    class Meta:
        model = UserProfile
        fields = [
            'user', 'profile_picture', 'profile_picture_url', 'bio', 'location',
            'portfolio_link', 'educations', 'skills', 'languages', 'portfolio_items',
        ]

    def get_profile_picture_url(self, obj):
        if obj.profile_picture:
            return self.context['request'].build_absolute_uri(obj.profile_picture.url)
        return None

    def update(self, instance, validated_data):
        # Extract nested data
        educations_data = validated_data.pop('educations', [])
        skills_data = validated_data.pop('skills', [])
        languages_data = validated_data.pop('languages', [])
        portfolios_data = validated_data.pop('portfolio_items', [])

        # Update basic fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()

        # Clear existing nested objects
        instance.educations.all().delete()
        instance.skills.all().delete()
        instance.languages.all().delete()
        instance.portfolio_items.all().delete()

        # Recreate nested entries
        for item in educations_data:
            Education.objects.create(profile=instance, **item)
        for item in skills_data:
            Skill.objects.create(profile=instance, **item)
        for item in languages_data:
            Language.objects.create(profile=instance, **item)
        for item in portfolios_data:
            PortfolioItem.objects.create(profile=instance, **item)

        return instance
