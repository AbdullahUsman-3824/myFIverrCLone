from django.db import models
from django.utils import timezone
from django.conf import settings
from django.utils.text import slugify

class TimeStampedModel(models.Model):
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True

class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(unique=True, blank=True)
    description = models.TextField(blank=True, null=True)
    image = models.ImageField(upload_to='category_images/', blank=True, null=True)
    is_active = models.BooleanField(default=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class SubCategory(models.Model):
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='subcategories')
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True, blank=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(f"{self.category.name}-{self.name}")
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.category.name} → {self.name}"


class Gig(TimeStampedModel):
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('active', 'Active'),
        ('paused', 'Paused'),
    ]

    seller = models.ForeignKey('accounts.SellerProfile', on_delete=models.CASCADE, related_name='gigs')
    title = models.CharField(max_length=100)
    description = models.TextField()
    category = models.ForeignKey('Category', on_delete=models.CASCADE)
    subcategory = models.ForeignKey('Subcategory', on_delete=models.CASCADE)
    delivery_time = models.IntegerField()
    tags = models.CharField(max_length=255, blank=True, null=True)
    thumbnail_image = models.ImageField(upload_to='gig_thumbnails/', blank=True, null=True)
    status = models.CharField(
        max_length=10,
        choices=STATUS_CHOICES,
        default='draft'
    )
    is_featured = models.BooleanField(default=False)

    def __str__(self):
        return self.title

    class Meta:
        indexes = [
            models.Index(fields=['category']),
            models.Index(fields=['subcategory']),
            models.Index(fields=['seller']),
        ]


class GigPackage(TimeStampedModel):
    PACKAGE_CHOICES = [
        ('Basic', 'Basic'),
        ('Standard', 'Standard'),
        ('Premium', 'Premium'),
    ]

    gig = models.ForeignKey('Gig', on_delete=models.CASCADE, related_name='packages')
    package_name = models.CharField(max_length=10, choices=PACKAGE_CHOICES)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    number_of_revisions = models.IntegerField(blank=True, null=True)
    delivery_days = models.IntegerField()

    def __str__(self):
        return f"{self.package_name} Package for {self.gig.title}"


class GigFAQ(models.Model):
    gig = models.ForeignKey('Gig', on_delete=models.CASCADE, related_name='faqs')
    question = models.TextField()
    answer = models.TextField()

    def __str__(self):
        return f"FAQ for {self.gig.title}: {self.question[:50]}..."


class GigGallery(models.Model):
    MEDIA_TYPE_CHOICES = [
        ('image', 'Image'),
        ('video', 'Video'),
    ]

    gig = models.ForeignKey('Gig', on_delete=models.CASCADE, related_name='gallery')
    media_type = models.CharField(max_length=10, choices=MEDIA_TYPE_CHOICES)
    media_file = models.FileField(upload_to='gig_gallery/', blank=True, null=True)
    # media_url = models.CharField(max_length=255) # Removed media_url

    def __str__(self):
        return f"{self.media_type.capitalize()} for {self.gig.title}"


class SavedGig(TimeStampedModel):
    ACTION_CHOICES = [
        ('save', 'Save'),
        ('unsave', 'Unsave'),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='saved_gigs')
    gig = models.ForeignKey('Gig', on_delete=models.CASCADE, related_name='saved_by_users')
    action = models.CharField(max_length=6, choices=ACTION_CHOICES)

    class Meta:
        unique_together = ('user', 'gig')
