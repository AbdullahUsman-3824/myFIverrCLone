from django.db import models
from django.utils import timezone
from django.conf import settings

# Create your models here.
class OrderRating(models.Model):
    order = models.ForeignKey('orders.Order', on_delete=models.CASCADE, related_name='ratings')
    buyer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='ratings_given')
    seller = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='ratings_received')
    rating = models.IntegerField()
    review = models.TextField(blank=True, null=True)
    timestamp = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"Rating for Order #{self.order.id} by {self.buyer.username}"

    class Meta:
        unique_together = ('order', 'buyer')  # Ensure one review per buyer per order

class GigRating(models.Model):
    gig = models.ForeignKey('gigs.Gig', on_delete=models.CASCADE, related_name='ratings')
    buyer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='gig_ratings_given')
    rating = models.IntegerField()
    review = models.TextField(blank=True, null=True)
    timestamp = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"Rating for Gig #{self.gig.id} by {self.buyer.username}"

    class Meta:
        unique_together = ('gig', 'buyer')  # Ensure one review per buyer per gig