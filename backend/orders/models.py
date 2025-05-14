from django.db import models
from django.utils import timezone
# Create your models here.
class Order(models.Model):
    STATUS_CHOICES = [
        ('placed', 'Placed'),
        ('accepted', 'Accepted'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]

    gig = models.ForeignKey('Gig', on_delete=models.CASCADE, related_name='orders')
    buyer = models.ForeignKey('auth.User', on_delete=models.CASCADE, related_name='orders_made')
    seller = models.ForeignKey('auth.User', on_delete=models.CASCADE, related_name='orders_received')
    package = models.ForeignKey('GigPackage', on_delete=models.CASCADE)
    description = models.TextField()
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='placed')
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Order #{self.id} - {self.gig.title} by {self.buyer.username}"

    class OrderMilestone(models.Model):
    order = models.ForeignKey('Order', on_delete=models.CASCADE, related_name='milestones')
    title = models.CharField(max_length=100)
    description = models.TextField()
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"Milestone: {self.title} (Order #{self.order.id})"

    class OrderAttachment(models.Model):
    order = models.ForeignKey('Order', on_delete=models.CASCADE, related_name='attachments')
    file_path = models.CharField(max_length=255)

    def __str__(self):
        return f"Attachment for Order #{self.order.id}"

    class OrderCancellation(models.Model):
    order = models.ForeignKey('Order', on_delete=models.CASCADE, related_name='cancellations')
    reason = models.TextField()
    is_dispute = models.BooleanField(default=False)

    def __str__(self):
        return f"Cancellation for Order #{self.order.id} - {'Dispute' if self.is_dispute else 'Voluntary'}"