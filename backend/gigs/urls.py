from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import (
    CategoryViewSet,
    SubCategoryViewSet,
    GigViewSet,
    SavedGigViewSet,
)

router = DefaultRouter()
router.register('categories', CategoryViewSet, basename='category')
router.register('subcategories', SubCategoryViewSet, basename='subcategory')
router.register('', GigViewSet, basename='gig')
router.register('saved', SavedGigViewSet, basename='savedgig')

urlpatterns = [
    path('', include(router.urls)),
]
