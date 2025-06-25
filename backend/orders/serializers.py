from rest_framework import serializers
from .models import Order
from gigs.models import Gig, GigPackage
from accounts.models import User


class OrderSerializer(serializers.ModelSerializer):
    buyer_username = serializers.CharField(source='buyer.username', read_only=True)
    seller_username = serializers.CharField(source='seller.username', read_only=True)
    gig_title = serializers.CharField(source='gig.title', read_only=True)
    package_name = serializers.CharField(source='package.package_name', read_only=True)

    class Meta:
        model = Order
        fields = [
            'id',
            'buyer', 'buyer_username',
            'seller', 'seller_username',
            'gig', 'gig_title',
            'package', 'package_name',
            'description',
            'total_amount',
            'status',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['buyer', 'seller', 'created_at', 'updated_at']

