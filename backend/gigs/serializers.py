from rest_framework import serializers
from .models import Category, SubCategory, Gig, GigPackage, GigFAQ, GigGallery, SavedGig
from accounts.serializers.profile_serializers import SellerProfileReadSerializer
import json


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
        read_only_fields = ['gig']


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


class GigSerializer(serializers.ModelSerializer):
    seller_id = serializers.PrimaryKeyRelatedField(source='seller', read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(queryset=Category.objects.all(), source='category', write_only=True)
    subcategory_id = serializers.PrimaryKeyRelatedField(queryset=SubCategory.objects.all(), source='subcategory', write_only=True)

    packages = GigPackageSerializer(many=True, required=False)
    faqs = GigFAQSerializer(many=True, required=False)
    gallery = GigGallerySerializer(many=True, required=False)

    class Meta:
        model = Gig
        fields = [
            'id', 'title', 'description', 'tags',
            'delivery_time', 'status', 'is_featured',
            'thumbnail_image', 'seller_id',
            'category_id', 'subcategory_id',
            'packages', 'faqs', 'gallery',
        ]
        read_only_fields = ['seller', 'seller_id']

    def create(self, validated_data):
        request = self.context['request']

        # Extract nested JSON fields
        packages_data = validated_data.pop('packages', [])
        faqs_data = validated_data.pop('faqs', [])

        # Parse gallery data from request
        gallery_meta = json.loads(request.data.get('gallery_meta', '[]'))
        gallery_files = request.FILES.getlist('gallery_files')

        # Combine media_type with corresponding file
        gallery_data = []
        for i, meta in enumerate(gallery_meta):
            try:
                gallery_data.append({
                    'media_type': meta['media_type'],
                    'media_file': gallery_files[i],
                })
            except IndexError:
                continue  # If a file is missing, skip safely

        # Create main gig instance
        gig = Gig.objects.create(**validated_data)

        # Create nested related objects
        self._create_or_update_packages(gig, packages_data)
        self._create_or_update_faqs(gig, faqs_data)
        self._create_or_update_gallery(gig, gallery_data)

        return gig

    def update(self, instance, validated_data):
        # Extract nested data
        packages_data = validated_data.pop('packages', None)
        faqs_data = validated_data.pop('faqs', None)
        gallery_data = validated_data.pop('gallery', None)

        # Update main fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        # Update related nested objects if present
        if packages_data is not None:
            self._update_nested_objects(instance, packages_data, GigPackage, 'packages')

        if faqs_data is not None:
            self._update_nested_objects(instance, faqs_data, GigFAQ, 'faqs')

        if gallery_data is not None:
            self._update_nested_objects(instance, gallery_data, GigGallery, 'gallery')

        return instance

    def _create_or_update_packages(self, gig, packages_data):
        for package in packages_data:
            GigPackage.objects.create(gig=gig, **package)

    def _create_or_update_faqs(self, gig, faqs_data):
        for faq in faqs_data:
            GigFAQ.objects.create(gig=gig, **faq)

    def _create_or_update_gallery(self, gig, gallery_data):
        for item in gallery_data:
            GigGallery.objects.create(gig=gig, **item)

    def _update_nested_objects(self, gig, nested_data, model_class, related_name):
        """
        Perform create/update/delete of related nested data for the given model.
        Uses 'id' field for matching existing objects.
        """
        existing_items = getattr(gig, related_name).all()
        existing_items_map = {item.id: item for item in existing_items}

        received_ids = set()
        for item_data in nested_data:
            item_id = item_data.get('id', None)
            if item_id and item_id in existing_items_map:
                # Update existing item
                obj = existing_items_map[item_id]
                for attr, value in item_data.items():
                    if attr != 'id':
                        setattr(obj, attr, value)
                obj.save()
                received_ids.add(item_id)
            else:
                # Create new item
                model_class.objects.create(gig=gig, **item_data)

        # Delete objects not in received payload
        for existing_id in existing_items_map:
            if existing_id not in received_ids:
                existing_items_map[existing_id].delete()

