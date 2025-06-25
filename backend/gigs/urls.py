from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import (
    CategoryViewSet,
    SubCategoryViewSet, 
    GigViewSet,
    SavedGigViewSet,
    GigsByCategoryView
)

router = DefaultRouter()
router.register('categories', CategoryViewSet, basename='category')
router.register('subcategories', SubCategoryViewSet, basename='subcategory')
router.register('saved', SavedGigViewSet, basename='savedgig')
router.register('', GigViewSet, basename='gig')

urlpatterns = [
    path("by-category/<int:category_id>/", GigsByCategoryView.as_view()),
    path('', include(router.urls)),
]
