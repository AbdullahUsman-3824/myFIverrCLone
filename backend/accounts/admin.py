from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import UserProfile

# Register your models here.
class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'email', 'is_buyer', 'is_seller', 'is_staff')
    list_filter = ('is_buyer', 'is_seller', 'is_staff')

admin.site.register(UserProfile, CustomUserAdmin)