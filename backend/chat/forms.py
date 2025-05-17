from django import forms
from .models import ChatConversation, ChatMessage, MessageAttachment

class ChatConversationForm(forms.ModelForm):
    class Meta:
        model = ChatConversation
        fields = ['user_2']  # user_1 will be the current user
        widgets = {
            'user_2': forms.Select(attrs={'class': 'form-control'})
        }

    def clean(self):
        cleaned_data = super().clean()
        user_2 = cleaned_data.get('user_2')
        if user_2 == self.instance.user_1:
            raise forms.ValidationError("You cannot start a conversation with yourself.")
        return cleaned_data

class ChatMessageForm(forms.ModelForm):
    class Meta:
        model = ChatMessage
        fields = ['message_text']
        widgets = {
            'message_text': forms.Textarea(attrs={
                'class': 'form-control',
                'rows': 3,
                'placeholder': 'Type your message here...'
            })
        }

    def clean_message_text(self):
        message = self.cleaned_data.get('message_text')
        if not message.strip():
            raise forms.ValidationError("Message cannot be empty.")
        return message

class MessageAttachmentForm(forms.ModelForm):
    class Meta:
        model = MessageAttachment
        fields = ['file_path', 'file_type']
        widgets = {
            'file_path': forms.FileInput(attrs={'class': 'form-control'}),
            'file_type': forms.Select(attrs={'class': 'form-control'})
        }

    def clean_file_type(self):
        file_type = self.cleaned_data.get('file_type')
        file_path = self.cleaned_data.get('file_path')
        if file_path:
            ext = file_path.name.split('.')[-1].lower()
            if ext not in dict(self.Meta.model.FILE_TYPE_CHOICES).keys():
                raise forms.ValidationError(f"File type {ext} is not supported.")
        return file_type 