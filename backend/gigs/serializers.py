from rest_framework import serializers
from .models import Category, SubCategory, Gig, GigPackage, GigFAQ, GigGallery, SavedGig
from accounts.serializers.profile_serializers import SellerProfileReadSerializer


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
    class Meta:
        model = GigPackage
        fields = '__all__'
        read_only_fields = ['gig']


class GigFAQSerializer(serializers.ModelSerializer):
    class Meta:
        model = GigFAQ
        fields = '__all__'
        read_only_fields = ['gig']


class GigGallerySerializer(serializers.ModelSerializer):
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
    seller = SellerProfileReadSerializer(read_only=True) 
    category = CategorySerializer(read_only=True)
    subcategory = SubCategorySerializer(read_only=True)
    packages = GigPackageSerializer(many=True, read_only=True)
    faqs = GigFAQSerializer(many=True, read_only=True)
    gallery = GigGallerySerializer(many=True, read_only=True)

    class Meta:
        model = Gig
        fields = '__all__'
        read_only_fields = ['seller', 'category', 'subcategory']

    def create(self, validated_data):
        request = self.context['request']
        seller_profile = request.user.seller_profile
        return Gig.objects.create(seller=seller_profile, **validated_data)
