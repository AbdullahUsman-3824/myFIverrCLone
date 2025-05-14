from django.db import models
from django.utils import timezone

# Create your models here.
class OrderRating(models.Model):
    order = models.ForeignKey('Order', on_delete=models.CASCADE, related_name='ratings')
    buyer = models.ForeignKey('auth.User', on_delete=models.CASCADE, related_name='ratings_given')
    seller = models.ForeignKey('auth.User', on_delete=models.CASCADE, related_name='ratings_received')
    rating = models.IntegerField()
    review = models.TextField(blank=True, null=True)
    timestamp = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"Rating for Order #{self.order.id} by {self.buyer.username}"

    class Meta:
        unique_together = ('order', 'buyer')  # Ensure one review per buyer per order

class GigRating(models.Model):
    gig = models.ForeignKey('Gig', on_delete=models.CASCADE, related_name='ratings')
    buyer = models.ForeignKey('auth.User', on_delete=models.CASCADE, related_name='gig_ratings_given')
    rating = models.IntegerField()
    review = models.TextField(blank=True, null=True)
    timestamp = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"Rating for Gig #{self.gig.id} by {self.buyer.username}"

    class Meta:
        unique_together = ('gig', 'buyer')  # Ensure one review per buyer per gig