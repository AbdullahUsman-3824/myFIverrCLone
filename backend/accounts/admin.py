from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, SellerProfile

class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'email', 'is_seller', 'is_staff', 'date_joined')
    list_filter = ('is_seller', 'is_staff', 'is_email_verified', 'is_profile_set')
    
    # Add fieldsets to control admin form layout
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Personal Info', {'fields': ('first_name', 'last_name', 'email', 'profile_picture')}),
        ('Permissions', {
            'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions'),
        }),
        ('Important dates', {'fields': ('last_login',), 'classes': ('collapse',)}),
        ('Custom Fields', {'fields': ('is_seller', 'current_role', 'is_email_verified', 'is_profile_set')}),
    )
    
    # For add user form
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'email', 'password1', 'password2', 'is_seller'),
        }),
    )
    
    readonly_fields = ('last_login', 'is_email_verified', 'is_profile_set')

admin.site.register(User, CustomUserAdmin)
admin.site.register(SellerProfile)