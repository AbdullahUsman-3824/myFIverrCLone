from django.contrib.auth.models import AbstractUser
from django.db import models

# -----------------------------
# Custom User Model
# -----------------------------

class User(AbstractUser):
    is_buyer = models.BooleanField(default=True)
    is_seller = models.BooleanField(default=False)

    ROLE_CHOICES = [
        ('buyer', 'Buyer'),
        ('seller', 'Seller'),
    ]
    current_role = models.CharField(
        max_length=10,
        choices=ROLE_CHOICES,
        default='buyer',
        help_text="Current session role: buyer or seller"
    )

   
    USERNAME_FIELD = 'username'  
    REQUIRED_FIELDS = ['email'] 

    def __str__(self):
        return self.username

    class Meta:
        swappable = 'AUTH_USER_MODEL' 

# -----------------------------
# User Profile Model
# -----------------------------

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
    profile_picture = models.ImageField(upload_to='profiles/', blank=True, null=True)
    bio = models.TextField(blank=True)
    location = models.CharField(max_length=100, blank=True)

    # Seller-specific fields
    portfolio_link = models.URLField(blank=True)  

    def __str__(self):
        return f"{self.user.username}'s Profile"

# -----------------------------
# Portfolio Model 
# -----------------------------

class PortfolioItem(models.Model):
    profile = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name="portfolio_items")
    title = models.CharField(max_length=255, verbose_name="Portfolio Title")
    description = models.TextField(verbose_name="Description")
    url_link = models.URLField(max_length=500, blank=True, null=True, verbose_name="URL Link")
    media_file = models.FileField(upload_to='portfolio_media/', verbose_name="Media File")

    class Meta:
        verbose_name = "Portfolio Item"
        verbose_name_plural = "Portfolio Items"
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.title} - {self.profile.user.username}"

# -----------------------------
# Education Model
# -----------------------------

class Education(models.Model):
    profile = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name="educations")
    institution_name = models.CharField(max_length=255)
    degree_title = models.CharField(max_length=255)
    start_year = models.PositiveIntegerField()
    end_year = models.PositiveIntegerField(blank=True, null=True)

    def __str__(self):
        return f"{self.degree_title} at {self.institution_name}"

# -----------------------------
# Skill Model
# -----------------------------

class Skill(models.Model):
    PROFICIENCY_CHOICES = [
        ("beginner", "Beginner"),
        ("intermediate", "Intermediate"),
        ("expert", "Expert"),
    ]

    profile = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name="skills")
    name = models.CharField(max_length=100)
    level = models.CharField(max_length=20, choices=PROFICIENCY_CHOICES)

    def __str__(self):
        return f"{self.name} - {self.level}"

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

    profile = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name="languages")
    name = models.CharField(max_length=100)
    level = models.CharField(max_length=20, choices=PROFICIENCY_CHOICES)

    def __str__(self):
        return f"{self.name} - {self.level}"