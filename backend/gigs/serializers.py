from rest_framework import serializers
from .models import Category, SubCategory, Gig, GigPackage, GigFAQ, GigGallery, SavedGig
from accounts.serializers.profile_serializers import SellerProfileMiniSerializer
import json
from django.db import transaction


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'
        read_only_fields = ['slug']


class SubCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = SubCategory
        fields = '__all__'
        read_only_fields = ['slug']


class GigPackageSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)

    class Meta:
        model = GigPackage
        fields = '__all__'


class GigFAQSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)

    class Meta:
        model = GigFAQ
        fields = '__all__'
        read_only_fields = ['gig']


class GigGallerySerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)

    class Meta:
        model = GigGallery
        fields = '__all__'
        read_only_fields = ['gig']


class SavedGigSerializer(serializers.ModelSerializer):
    class Meta:
        model = SavedGig
        fields = '__all__'
        read_only_fields = ['gig']

class GigInlineSerializer(serializers.ModelSerializer):
    class Meta:
        model = Gig
        fields = ['id', 'title', 'category', 'delivery_time'] 

class GigSerializer(serializers.ModelSerializer):
    """
    Serializer for Gig model with nested representations for packages, FAQs, and gallery items.
    Handles creation and updates of gigs along with their related objects.
    """
    # ID fields for related models
    seller_id = serializers.PrimaryKeyRelatedField(source='seller', read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(),
        source='category',
        write_only=False
    )
    subcategory_id = serializers.PrimaryKeyRelatedField(
        queryset=SubCategory.objects.all(),
        source='subcategory',
        write_only=False
    )

    # Read-only name fields for related models
    category_name = serializers.CharField(source='category.name', read_only=True)
    subcategory_name = serializers.CharField(source='subcategory.name', read_only=True)
    seller = SellerProfileMiniSerializer(read_only=True)

    # Nested serializers
    packages = GigPackageSerializer(many=True, required=False)
    faqs = GigFAQSerializer(many=True, required=False)
    gallery = GigGallerySerializer(many=True, required=False, read_only=True)

    class Meta:
        model = Gig
        fields = [
            'id', 'title', 'description', 'tags',
            'delivery_time', 'status', 'is_featured',
            'thumbnail_image', 'seller_id','seller',
            'category_id', 'subcategory_id',
            'category_name', 'subcategory_name',
            'packages', 'faqs', 'gallery',
        ]
        read_only_fields = ['seller', 'seller_id']

    def to_internal_value(self, data):
        # Handle multipart/form-data where nested fields come as JSON strings
        if isinstance(data, dict):
            for field in ['packages', 'faqs', 'gallery_meta']:
                if field in data and isinstance(data[field], str):
                    try:
                        data[field] = json.loads(data[field])
                    except json.JSONDecodeError:
                        data[field] = []
            thumbnail = data.get('thumbnail_image')
            if isinstance(thumbnail, str) and self.instance:
                data = data.copy()
                data['thumbnail_image'] = self.instance.thumbnail_image
        
        return super().to_internal_value(data)

    def validate(self, attrs):
        for field in ['packages', 'faqs']:
            raw_data = self.initial_data.get(field)

            if raw_data:
                if isinstance(raw_data, str):
                    try:
                        raw_data = json.loads(raw_data)
                    except json.JSONDecodeError:
                        raise serializers.ValidationError({field: 'Invalid JSON format'})

                if not isinstance(raw_data, list):
                    raise serializers.ValidationError({field: 'Expected a list'})

                for i, item in enumerate(raw_data):
                    if not isinstance(item, dict):
                        raise serializers.ValidationError({field: f"Item {i} must be an object."})
                    if field == 'packages':
                        if 'package_name' not in item:
                            raise serializers.ValidationError({field: f"package_name missing in item {i}"})

                attrs[field] = raw_data

        return super().validate(attrs)

    @transaction.atomic
    def create(self, validated_data):
        """
        Create a new Gig instance with nested related objects.
        """
        request = self.context.get('request')
        if not request:
            raise serializers.ValidationError("Request context is required")

        # If status is draft, change to active
        if validated_data.get('status') == 'draft':
            validated_data['status'] = 'active'

        # Extract nested data with proper defaults
        packages_data = validated_data.pop('packages', [])
        faqs_data = validated_data.pop('faqs', [])
        gallery_data = self._parse_gallery_data(request)
    
        # Create main gig instance
        gig = Gig.objects.create(**validated_data)

        # Create related objects
        self._create_related_objects(gig, packages_data, GigPackage)
        self._create_related_objects(gig, faqs_data, GigFAQ)
        self._create_related_objects(gig, gallery_data, GigGallery)

        return gig

    @transaction.atomic
    def update(self, instance, validated_data):
        """
        Update an existing Gig instance and its related objects.
        """
        request = self.context.get('request')
        if not request:
            raise serializers.ValidationError("Request context is required")
        
        # If status is draft, change to active
        if validated_data.get('status') == 'draft':
            validated_data['status'] = 'active'

        # Handle updates to nested data
        packages_data = validated_data.pop('packages', None)
        faqs_data = validated_data.pop('faqs', None)
        gallery_data = self._parse_gallery_data(request)

        # Update main gig fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        # Update nested objects if provided
        if packages_data is not None:
            self._handle_nested_update(instance.packages, packages_data, GigPackage)

        if faqs_data is not None:
            self._handle_nested_update(instance.faqs, faqs_data, GigFAQ)

        if gallery_data is not None:
            self._handle_nested_update(instance.gallery, gallery_data, GigGallery)

        return instance

    def _create_related_objects(self, gig, items_data, model_class):
        """
        Helper method to bulk create related objects.
        """
        if items_data:
            model_class.objects.bulk_create(
                [model_class(gig=gig, **item_data) for item_data in items_data]
            )

    def _parse_gallery_data(self, request):
        """
        Parse only new gallery data from request.
        Existing gallery items (URLs) will be preserved by skipping them.
        """
        try:
            gallery_meta = request.data.get('gallery_meta', '[]')
            if isinstance(gallery_meta, str):
                gallery_meta = json.loads(gallery_meta)

            gallery_files = request.FILES.getlist('gallery_files', [])

            parsed_gallery = []
            for i, meta in enumerate(gallery_meta):
                if isinstance(meta, dict) and i < len(gallery_files):
                    media_file = gallery_files[i]
                    if hasattr(media_file, 'read'):  # new file only
                        parsed_gallery.append({
                            'media_type': meta.get('media_type'),
                            'media_file': media_file,
                        })

            return parsed_gallery

        except json.JSONDecodeError:
            raise serializers.ValidationError("Invalid gallery metadata format")
        except Exception as e:
            raise serializers.ValidationError(f"Error processing gallery data: {str(e)}")

    def _handle_nested_update(self, manager, new_data, model_class):
        """
        Handles updates for nested objects (packages, faqs, gallery).
        - Updates existing items by ID.
        - Preserves existing gallery items if they are not new uploads.
        - Adds new ones.
        - Only deletes if explicitly missing and it's not a gallery.
        """
        existing_items = {item.id: item for item in manager.all()}
        new_items = []

        is_gallery = model_class.__name__ == "GigGallery"

        for item_data in new_data:
            item_id = item_data.get("id")

            # Remove 'gig' from incoming data if present
            item_data.pop("gig", None)

            # Update existing items
            if item_id and item_id in existing_items:
                item = existing_items[item_id]
                for field, value in item_data.items():
                    if field != "id" and hasattr(item, field):
                        setattr(item, field, value)
                item.save()
                del existing_items[item_id]

            # Create new item (for gallery, this will be newly uploaded files)
            else:
                new_items.append(model_class(gig=manager.instance, **item_data))

        # Create new items if any
        if new_items:
            model_class.objects.bulk_create(new_items)

        # For non-gallery models, delete removed items
        if not is_gallery and existing_items:
            manager.filter(id__in=existing_items.keys()).delete()
