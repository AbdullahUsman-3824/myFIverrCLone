from django.contrib.auth.models import AbstractUser
from django.core.exceptions import ValidationError
from django.core.validators import MinValueValidator, MaxValueValidator, FileExtensionValidator
from django.db import models
from django.utils import timezone
import datetime


# -----------------------------
# Custom User Model
# -----------------------------

class User(AbstractUser):
    is_seller = models.BooleanField(default=False, db_index=True)

    ROLE_CHOICES = [
        ('buyer', 'Buyer'),
        ('seller', 'Seller'),
    ]
    current_role = models.CharField(
        max_length=10,
        choices=ROLE_CHOICES,
        default='buyer',
        help_text="Current session role: buyer or seller",
        db_index=True
    )

    profile_picture = models.ImageField(
        upload_to='profile_pics/',
        blank=True,
        validators=[FileExtensionValidator(allowed_extensions=['jpg', 'jpeg', 'png'])]
    )
    is_email_verified = models.BooleanField(default=False, db_index=True)
    is_profile_set = models.BooleanField(default=False, db_index=True)
    date_joined = models.DateTimeField(auto_now_add=True, db_index=True)

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['email']

    def __str__(self):
        return self.username

    class Meta:
        swappable = 'AUTH_USER_MODEL'
        ordering = ['-date_joined']
        verbose_name = 'User'
        verbose_name_plural = 'Users'
        indexes = [
            models.Index(fields=['email']),
            models.Index(fields=['username']),
            models.Index(fields=['is_active']),
        ]


# -----------------------------
# Seller Profile Model
# -----------------------------

class SellerProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='seller_profile')
    profile_title = models.CharField(max_length=100, db_index=True)
    bio = models.TextField()
    location = models.CharField(max_length=100, blank=True, db_index=True)
    portfolio_link = models.URLField(blank=True)
    is_profile_complete = models.BooleanField(default=False, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.username}'s Profile"

    class Meta:
        verbose_name = 'Seller Profile'
        verbose_name_plural = 'Seller Profiles'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['is_profile_complete']),
            models.Index(fields=['location']),
        ]


# -----------------------------
# Portfolio Model
# -----------------------------

class PortfolioItem(models.Model):
    profile = models.ForeignKey(
        SellerProfile, 
        on_delete=models.CASCADE, 
        related_name="portfolio_items",
        db_index=True
    )
    title = models.CharField(max_length=255, db_index=True)
    description = models.TextField()
    url_link = models.URLField(max_length=500, blank=True, null=True)
    media_file = models.FileField(
        upload_to='portfolio_media/',
        validators=[FileExtensionValidator(allowed_extensions=['jpg', 'jpeg', 'png', 'mp4', 'pdf', 'docx'])]
    )
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True, db_index=True)

    class Meta:
        verbose_name = 'Portfolio Item'
        verbose_name_plural = 'Portfolio Items'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['title']),
            models.Index(fields=['created_at', 'updated_at']),
        ]

    def __str__(self):
        return f"{self.title} - {self.profile.user.username}"


# -----------------------------
# Education Model
# -----------------------------

def validate_year(value):
    current_year = datetime.date.today().year
    if value < 1950 or value > current_year + 5:
        raise ValidationError(f"{value} is not a valid year.")


class Education(models.Model):
    profile = models.ForeignKey(
        SellerProfile, 
        on_delete=models.CASCADE, 
        related_name="educations",
        db_index=True
    )
    institution_name = models.CharField(max_length=255, db_index=True)
    degree_title = models.CharField(max_length=255)
    start_year = models.PositiveIntegerField(validators=[validate_year])
    end_year = models.PositiveIntegerField(blank=True, null=True, validators=[validate_year])
    created_at = models.DateTimeField(default=timezone.now)

    def clean(self):
        if self.end_year and self.end_year < self.start_year:
            raise ValidationError("End year cannot be earlier than start year.")

    def __str__(self):
        return f"{self.profile.user.username} - {self.degree_title} at {self.institution_name}"

    class Meta:
        ordering = ['-start_year']


# -----------------------------
# Skill Model
# -----------------------------

class Skill(models.Model):
    PROFICIENCY_CHOICES = [
        ("beginner", "Beginner"),
        ("intermediate", "Intermediate"),
        ("expert", "Expert"),
    ]

    profile = models.ForeignKey(SellerProfile, on_delete=models.CASCADE, related_name="skills")
    name = models.CharField(max_length=100)
    level = models.CharField(max_length=20, choices=PROFICIENCY_CHOICES)
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"{self.profile.user.username} - {self.name} ({self.level})"

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['profile', 'name'],
                name='unique_%(class)s_per_profile'
            )
        ]
        ordering = ['name']


# -----------------------------
# Language Model
# -----------------------------

class Language(models.Model):
    PROFICIENCY_CHOICES = [
        ("basic", "Basic"),
        ("conversational", "Conversational"),
        ("fluent", "Fluent"),
        ("native", "Native"),
    ]

    profile = models.ForeignKey(SellerProfile, on_delete=models.CASCADE, related_name="languages")
    name = models.CharField(max_length=100)
    level = models.CharField(max_length=20, choices=PROFICIENCY_CHOICES)
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"{self.profile.user.username} - {self.name} ({self.level})"

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['profile', 'name'],
                name='unique_%(class)s_per_profile'
            )
        ]        
        ordering = ['name']
