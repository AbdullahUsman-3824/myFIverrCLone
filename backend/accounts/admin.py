from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User

class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'email', 'is_buyer', 'is_seller', 'is_staff')
    list_filter = ('is_buyer', 'is_seller', 'is_staff')
    
    # Add fieldsets to control admin form layout
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Personal Info', {'fields': ('first_name', 'last_name', 'email')}),
        ('Permissions', {
            'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions'),
        }),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
        ('Custom Fields', {'fields': ('is_buyer', 'is_seller', 'current_role')}),
    )
    
    # For add user form
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'email', 'password1', 'password2', 'is_buyer', 'is_seller'),
        }),
    )

admin.site.register(User, CustomUserAdmin)