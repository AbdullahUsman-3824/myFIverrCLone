# accounts/models.py

from django.db import models
from django.contrib.auth.models import AbstractUser
from django_countries.fields import CountryField
# from cloudinary.models import CloudinaryField


class UserProfile(AbstractUser):
    is_buyer = models.BooleanField(default=False)
    is_seller = models.BooleanField(default=False)

    def __str__(self):
        return self.username
