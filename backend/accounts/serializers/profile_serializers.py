from rest_framework import serializers
from django.core.validators import URLValidator, validate_image_file_extension
from django.core.exceptions import ValidationError
from django.utils import timezone
from django.contrib.auth import get_user_model
from django.db import transaction
from ..models import SellerProfile, PortfolioItem, Education, Skill, Language

User = get_user_model()

# ===========================
# Helper Classes & Validators
# ===========================

class BaseProfileItemSerializer(serializers.ModelSerializer):
    """Base serializer for all profile-related items with common fields"""
    class Meta:
        abstract = True
        fields = ['id', 'name', 'created_at']
        read_only_fields = ['id', 'created_at']

def validate_year(value):
    current_year = timezone.now().year
    if not (1900 <= value <= current_year + 5):
        raise serializers.ValidationError(
            f"Year must be between 1900 and {current_year + 5}"
        )
    return value

def validate_file_size(value):
    if value.size > 5 * 1024 * 1024:
        raise serializers.ValidationError('File too large. Should not exceed 5MB.')
    return value

def validate_media_file(value):
    validate_file_size(value)
    validate_image_file_extension(value)
    content_type = value.content_type
    valid_types = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf']
    if content_type not in valid_types:
        raise ValidationError(f"Unsupported file type: {content_type}. Allowed: JPEG, PNG, GIF, PDF.")
    return value

# ===========================
# Profile Component Serializers
# ===========================

class EducationSerializer(serializers.ModelSerializer):
    start_year = serializers.IntegerField(validators=[validate_year])
    end_year = serializers.IntegerField(validators=[validate_year], required=False, allow_null=True)

    class Meta:
        model = Education
        fields = ['id', 'institution_name', 'degree_title', 'start_year', 'end_year', 'created_at']
        read_only_fields = ['id', 'created_at']

    def validate(self, data):
        if data.get('end_year') and data['end_year'] < data['start_year']:
            raise serializers.ValidationError("End year must be >= start year")
        return data

class SkillSerializer(BaseProfileItemSerializer):
    LEVEL_CHOICES = [
        ('beginner', 'Beginner'),
        ('intermediate', 'Intermediate'),
        ('advanced', 'Advanced'),
        ('expert', 'Expert'),
    ]
    level = serializers.ChoiceField(choices=LEVEL_CHOICES)
    name = serializers.CharField(max_length=100)

    class Meta(BaseProfileItemSerializer.Meta):
        model = Skill
        fields = BaseProfileItemSerializer.Meta.fields + ['level']

class LanguageSerializer(BaseProfileItemSerializer):
    LEVEL_CHOICES = [
        ('basic', 'Basic'),
        ('conversational', 'Conversational'),
        ('fluent', 'Fluent'),
        ('native', 'Native'),
    ]
    level = serializers.ChoiceField(choices=LEVEL_CHOICES)
    name = serializers.CharField(max_length=50)

    class Meta(BaseProfileItemSerializer.Meta):
        model = Language
        fields = BaseProfileItemSerializer.Meta.fields + ['level']

class PortfolioItemSerializer(serializers.ModelSerializer):
    media_file = serializers.FileField(validators=[validate_media_file], required=False)
    url_link = serializers.URLField(required=False, validators=[URLValidator(schemes=['http', 'https'])], allow_blank=True)

    class Meta:
        model = PortfolioItem
        fields = ['id', 'title', 'description', 'url_link', 'media_file', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']

    def validate(self, data):
        if not data.get('url_link') and not data.get('media_file'):
            raise serializers.ValidationError("Either URL link or media file must be provided")
        return data

# ===========================
# Seller Profile Serializers
# ===========================

class UserSummarySerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'profile_picture', 'first_name', 'last_name']
        read_only_fields = fields

class SellerProfileSerializer(serializers.ModelSerializer):
    """Full Update Serializer"""
    id = serializers.IntegerField(read_only=True)
    user = UserSummarySerializer(read_only=True)

    educations = EducationSerializer(many=True, required=False)
    skills = SkillSerializer(many=True, required=False)
    languages = LanguageSerializer(many=True, required=False)
    portfolio_items = PortfolioItemSerializer(many=True, required=False)

    class Meta:
        model = SellerProfile
        fields = [
            'id', 'user',
            'profile_title', 'bio', 'portfolio_link',
            'is_profile_complete', 'created_at',
            'educations', 'skills', 'languages', 'portfolio_items'
        ]
        read_only_fields = ['id', 'user', 'is_profile_complete', 'created_at']

    def _check_profile_completeness(self, instance):
        required_fields = [
            bool(instance.profile_title and len(instance.profile_title) >= 5),
            bool(instance.bio and len(instance.bio) >= 50),
        ]
        required_relations = [
            instance.educations.exists(),
            instance.languages.exists(),
            instance.portfolio_items.exists()
        ]
        return all(required_fields) and all(required_relations)

    def _update_related_objects(self, instance, field_name, model_class, items_data):
        if items_data is None:
            return
        related_manager = getattr(instance, field_name)
        related_manager.all().delete()
        for item_data in items_data:
            related_manager.create(**item_data)

    @transaction.atomic
    def update(self, instance, validated_data): 
        related_fields = {
            'educations': (Education, validated_data.pop('educations', None)),
            'skills': (Skill, validated_data.pop('skills', None)),
            'languages': (Language, validated_data.pop('languages', None)),
            'portfolio_items': (PortfolioItem, validated_data.pop('portfolio_items', None)),
        }

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        if not instance.user.is_seller:
            instance.user.is_seller = True
            instance.user.current_role = 'seller'
            instance.user.save()

        for field_name, (model_class, items_data) in related_fields.items():
            self._update_related_objects(instance, field_name, model_class, items_data)

        instance.is_profile_complete = self._check_profile_completeness(instance)
        instance.save()
        return instance

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        rep['education_count'] = instance.educations.count()
        rep['skills_count'] = instance.skills.count()
        rep['languages_count'] = instance.languages.count()
        rep['portfolio_items_count'] = instance.portfolio_items.count()
        return rep


class SellerProfileReadSerializer(serializers.ModelSerializer):
    """Minimal Read-Only Serializer for nesting (e.g., in GigSerializer)"""
    class Meta:
        model = SellerProfile
        fields = ['id', 'profile_title', 'bio', 'portfolio_link', 'is_profile_complete']
