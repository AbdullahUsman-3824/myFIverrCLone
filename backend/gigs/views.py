from rest_framework import generics, permissions, viewsets
from rest_framework.decorators import action
from rest_framework import serializers
from rest_framework.response import Response
from .models import Category, SubCategory, Gig, GigPackage, GigFAQ, GigGallery, SavedGig
from .serializers import CategorySerializer, SubCategorySerializer, GigSerializer, GigPackageSerializer, GigFAQSerializer, GigGallerySerializer, SavedGigSerializer
from rest_framework import status
from django.shortcuts import get_object_or_404
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters


# -----------------------------------------------------------------------------
# Category Views
# -----------------------------------------------------------------------------
class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.filter(is_active=True)
    serializer_class = CategorySerializer

    def get_permissions(self):
        """
        Instantiates and returns the list of permissions that this view requires.
        """
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]
    


class SubCategoryViewSet(viewsets.ModelViewSet):
    queryset = SubCategory.objects.all()
    serializer_class = SubCategorySerializer
    permission_classes = [permissions.IsAdminUser]


# -----------------------------------------------------------------------------
# Gig Views
# -----------------------------------------------------------------------------
class GigViewSet(viewsets.ModelViewSet):
    serializer_class = GigSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category__slug', 'subcategory__slug', 'seller__id', 'is_featured'] # Define fields for filtering
    search_fields = ['title', 'description'] # Enable search by title and description
    ordering_fields = ['price', 'created_at'] # Enable ordering by price and created_at

    def get_queryset(self):
        queryset = Gig.objects.all()
        return queryset

    def perform_create(self, serializer):
        """
        Automatically sets the seller to the current user's seller profile.
        """
        serializer.save(seller=self.request.user.seller_profile)

    @action(detail=True, methods=['get'])
    def packages(self, request, pk=None):
        """
        Retrieves all packages for a specific gig.
        """
        gig = self.get_object()
        packages = gig.packages.all()
        serializer = GigPackageSerializer(packages, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def faqs(self, request, pk=None):
        """
        Retrieves all FAQs for a specific gig.
        """
        gig = self.get_object()
        faqs = gig.faqs.all()
        serializer = GigFAQSerializer(faqs, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def gallery(self, request, pk=None):
        """
        Retrieves all gallery items for a specific gig.
        """
        gig = self.get_object()
        gallery = gig.gallery.all()
        serializer = GigGallerySerializer(gallery, many=True)
        return Response(serializer.data)


# -----------------------------------------------------------------------------
# GigPackage Views
# -----------------------------------------------------------------------------
class GigPackageViewSet(viewsets.ModelViewSet):
    serializer_class = GigPackageSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        """
        Filters the queryset to only include packages for the specified gig (if gig_id is provided).
        """
        queryset = GigPackage.objects.all()
        gig_id = self.request.query_params.get('gig_id', None)
        if gig_id is not None:
            queryset = queryset.filter(gig_id=gig_id)
        return queryset

    def perform_create(self, serializer):
        """
        Automatically sets the gig for the package based on the gig_id in the request.
        """
        gig_id = self.request.data.get('gig_id', None)
        if gig_id is None:
            raise serializers.ValidationError("gig_id is required to create a GigPackage.")

        gig = get_object_or_404(Gig, pk=gig_id)
        serializer.save(gig=gig)


# -----------------------------------------------------------------------------
# GigFAQ Views
# -----------------------------------------------------------------------------
class GigFAQViewSet(viewsets.ModelViewSet):
    serializer_class = GigFAQSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        """
        Filters the queryset to only include FAQs for the specified gig (if gig_id is provided).
        """
        queryset = GigFAQ.objects.all()
        gig_id = self.request.query_params.get('gig_id', None)
        if gig_id is not None:
            queryset = queryset.filter(gig_id=gig_id)
        return queryset

    def perform_create(self, serializer):
        """
        Automatically sets the gig for the FAQ based on the gig_id in the request.
        """
        gig_id = self.request.data.get('gig_id', None)
        if gig_id is None:
            raise serializers.ValidationError("gig_id is required to create a GigFAQ.")

        gig = get_object_or_404(Gig, pk=gig_id)
        serializer.save(gig=gig)


# -----------------------------------------------------------------------------
# GigGallery Views
# -----------------------------------------------------------------------------
class GigGalleryViewSet(viewsets.ModelViewSet):
    serializer_class = GigGallerySerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        """
        Filters the queryset to only include gallery items for the specified gig (if gig_id is provided).
        """
        queryset = GigGallery.objects.all()
        gig_id = self.request.query_params.get('gig_id', None)
        if gig_id is not None:
            queryset = queryset.filter(gig_id=gig_id)
        return queryset

    def perform_create(self, serializer):
        """
        Automatically sets the gig for the gallery item based on the gig_id in the request.
        """
        gig_id = self.request.data.get('gig_id', None)
        if gig_id is None:
            raise serializers.ValidationError("gig_id is required to create a GigGallery.")

        gig = get_object_or_404(Gig, pk=gig_id)
        serializer.save(gig=gig)


# -----------------------------------------------------------------------------
# SavedGig Views
# -----------------------------------------------------------------------------
class SavedGigViewSet(viewsets.ModelViewSet):
    serializer_class = SavedGigSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """
        Filters the queryset to only include saved gigs for the current user.
        """
        return SavedGig.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        """
        Automatically sets the user and gig for the saved gig.
        """
        gig_id = self.request.data.get('gig_id', None)
        if gig_id is None:
            raise serializers.ValidationError("gig_id is required to save a Gig.")

        gig = get_object_or_404(Gig, pk=gig_id)
        # Check if the gig is already saved by the user
        if SavedGig.objects.filter(user=self.request.user, gig=gig).exists():
            raise serializers.ValidationError("This gig is already saved.")

        serializer.save(user=self.request.user, gig=gig, action='save')

    def destroy(self, request, pk=None):
        """
        Allows a user to "unsave" a gig by deleting the SavedGig object.
        """
        try:
            saved_gig = SavedGig.objects.get(pk=pk, user=request.user)
            saved_gig.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except SavedGig.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
    
