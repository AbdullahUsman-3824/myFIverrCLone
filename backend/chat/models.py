from django.db import models
from django.utils import timezone
from django.conf import settings
# Create your models here.
class ChatConversation(models.Model):
    user_1 = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='conversations_started')
    user_2 = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='conversations_received')
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"Conversation between {self.user_1.username} and {self.user_2.username}"

    class Meta:
        unique_together = ('user_1', 'user_2')

class ChatMessage(models.Model):
    conversation = models.ForeignKey('ChatConversation', on_delete=models.CASCADE, related_name='messages')
    sender = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='sent_messages')
    message_text = models.TextField()
    timestamp = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"Message from {self.sender.username} in conversation {self.conversation.id} at {self.timestamp}"

    class Meta:
        ordering = ['timestamp']

class MessageAttachment(models.Model):
    FILE_TYPE_CHOICES = [
        ('jpg', 'JPG'),
        ('png', 'PNG'),
        ('pdf', 'PDF'),
        ('docx', 'DOCX'),
        ('mp4', 'MP4'),
    ]

    message = models.ForeignKey('ChatMessage', on_delete=models.CASCADE, related_name='attachments')
    file_path = models.CharField(max_length=255)
    file_type = models.CharField(max_length=4, choices=FILE_TYPE_CHOICES)

    def __str__(self):
        return f"Attachment for Message #{self.message.id} ({self.file_type})"

