from rest_framework import permissions
from django.utils.translation import gettext_lazy as _

class IsSeller(permissions.BasePermission):
    """
    Custom permission to only allow sellers to access the view.
    """
    def has_permission(self, request, view):
        return request.user and request.user.is_seller

class IsProfileOwner(permissions.BasePermission):
    """
    Custom permission to only allow owners of a profile to edit it.
    """
    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request,
        # so we'll always allow GET, HEAD or OPTIONS requests.
        if request.method in permissions.SAFE_METHODS:
            return True

        # Write permissions are only allowed to the owner of the profile
        return obj.user == request.user

class IsSellerProfileOwner(permissions.BasePermission):
    """
    Custom permission to only allow owners of a seller profile to edit it.
    """
    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request
        if request.method in permissions.SAFE_METHODS:
            return True

        # Write permissions are only allowed to the owner of the seller profile
        return obj.user == request.user

class IsPortfolioItemOwner(permissions.BasePermission):
    """
    Custom permission to only allow owners of a portfolio item to edit it.
    """
    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request
        if request.method in permissions.SAFE_METHODS:
            return True

        # Write permissions are only allowed to the owner of the portfolio item
        return obj.profile.user == request.user

class IsEducationOwner(permissions.BasePermission):
    """
    Custom permission to only allow owners of an education entry to edit it.
    """
    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request
        if request.method in permissions.SAFE_METHODS:
            return True

        # Write permissions are only allowed to the owner of the education entry
        return obj.profile.user == request.user

class IsSkillOwner(permissions.BasePermission):
    """
    Custom permission to only allow owners of a skill entry to edit it.
    """
    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request
        if request.method in permissions.SAFE_METHODS:
            return True

        # Write permissions are only allowed to the owner of the skill entry
        return obj.profile.user == request.user

class IsLanguageOwner(permissions.BasePermission):
    """
    Custom permission to only allow owners of a language entry to edit it.
    """
    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request
        if request.method in permissions.SAFE_METHODS:
            return True

        # Write permissions are only allowed to the owner of the language entry
        return obj.profile.user == request.user

class IsVerifiedUser(permissions.BasePermission):
    """
    Custom permission to only allow verified users to access the view.
    """
    message = _('Please verify your email address to access this resource.')

    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        return request.user.is_email_verified

    def has_object_permission(self, request, view, obj):
        if not request.user or not request.user.is_authenticated:
            return False
        return request.user.is_email_verified

class IsProfileComplete(permissions.BasePermission):
    """
    Custom permission to only allow users with complete profiles to access the view.
    """
    def has_permission(self, request, view):
        return request.user and request.user.is_profile_set 