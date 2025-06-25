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
import json
from django.db.models import Q, Min
from rest_framework.views import APIView

class GigsByCategoryView(APIView):
    def get(self, request, category_id):
        gigs = Gig.objects.filter(category_id=category_id)
        serializer = GigSerializer(gigs, many=True, context={"request": request})
        return Response(serializer.data, status=status.HTTP_200_OK)

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
        return [permissions.IsAdminUser ()]


class SubCategoryViewSet(viewsets.ModelViewSet):
    serializer_class = SubCategorySerializer

    def get_queryset(self):
        category_id = self.request.query_params.get('category')
        queryset = SubCategory.objects.all()

        if category_id:
            queryset = queryset.filter(category_id=category_id)

        return queryset.order_by('id') 

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]



# -----------------------------------------------------------------------------
# Gig Views
# -----------------------------------------------------------------------------

class GigViewSet(viewsets.ModelViewSet):
    serializer_class = GigSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category__slug', 'subcategory__slug', 'seller__id', 'is_featured']
    search_fields = ['title', 'description', 'seller__user__first_name', 'seller__user__username']
    ordering_fields = ['min_price', 'created_at']

    def get_queryset(self):
        queryset = Gig.objects.all().annotate(min_price=Min('packages__price'))
        q = self.request.query_params.get('q')
        sort = self.request.query_params.get('sort')

        if q:
            category_matches = queryset.filter(
                Q(category__name__icontains=q) |
                Q(subcategory__name__icontains=q)
            ).distinct()

            if category_matches.exists():
                queryset = category_matches
            else:
                queryset = queryset.filter(
                    Q(title__icontains=q) |
                    Q(description__icontains=q) |
                    Q(seller__user__username__icontains=q) |
                    Q(seller__user__first_name__icontains=q) |
                    Q(seller__user__last_name__icontains=q)
                ).distinct()

        # Handle custom sort logic
        if sort == 'price-low':
            queryset = queryset.order_by('min_price')
        elif sort == 'price-high':
            queryset = queryset.order_by('-min_price')
        elif sort == 'newest':
            queryset = queryset.order_by('-created_at')
        elif sort == 'popular':
            queryset = queryset.order_by('-rating')  # Make sure this field exists

        return queryset

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

    def _parse_json_fields(self, request, data, fields):
        """
        Helper method to parse JSON string fields into Python objects.
        Handles both direct JSON strings and lists containing JSON strings.
        """
        for field in fields:
            if field not in data:
                continue

            raw_value = data[field]
            
            # Handle case where value is a single-element list
            if isinstance(raw_value, list) and len(raw_value) == 1:
                
                raw_value = raw_value[0]
            
            # Parse if the value is a JSON string
            if isinstance(raw_value, str):
                try:
                    data[field] = json.loads(raw_value)
                except json.JSONDecodeError:
                    # If parsing fails, keep the original value
                    continue
            
        return data


    def create(self, request, *args, **kwargs):
        """Create a new gig with parsed JSON fields."""
        data = request.data.copy()
        data = self._parse_json_fields(request, data, ['packages', 'faqs'])
        
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)   
        self.perform_create(serializer)
        return Response(serializer.data, status=201)

    def update(self, request, *args, **kwargs):
        """Update an existing gig with parsed JSON fields."""
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        data = request.data.copy()
        data = self._parse_json_fields(request, data, ['packages', 'faqs'])

        serializer = self.get_serializer(instance, data=data, partial=partial)
        if not serializer.is_valid():
            print("Serializer errors:", serializer.errors)  # 👈 helpful log
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        self.perform_update(serializer)
        return Response(serializer.data)

    def perform_create(self, serializer):
        """Automatically set the seller to the current user's seller profile."""
        serializer.save(seller=self.request.user.seller_profile)

    # Custom actions
    @action(detail=False, methods=['get'], url_path='my-gigs', permission_classes=[permissions.IsAuthenticated])
    def my_gigs(self, request):
        """Get all gigs belonging to the current authenticated user."""
        gigs = Gig.objects.filter(seller=request.user.seller_profile)
        serializer = self.get_serializer(gigs, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def packages(self, request, pk=None):
        """Get all packages for a specific gig."""
        gig = self.get_object()
        serializer = GigPackageSerializer(gig.packages.all(), many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def faqs(self, request, pk=None):
        """Get all FAQs for a specific gig."""
        gig = self.get_object()
        serializer = GigFAQSerializer(gig.faqs.all(), many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def gallery(self, request, pk=None):
        """Get all gallery items for a specific gig."""
        gig = self.get_object()
        serializer = GigGallerySerializer(gig.gallery.all(), many=True)
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

        serializer.save(user=self.request.user, gig=gig)

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
