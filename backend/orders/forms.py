from django import forms
from .models import Order, OrderMilestone, OrderAttachment, OrderCancellation

class OrderForm(forms.ModelForm):
    class Meta:
        model = Order
        fields = ['gig', 'package', 'description']
        widgets = {
            'gig': forms.Select(attrs={'class': 'form-control'}),
            'package': forms.Select(attrs={'class': 'form-control'}),
            'description': forms.Textarea(attrs={
                'class': 'form-control',
                'rows': 4,
                'placeholder': 'Describe your requirements in detail...'
            })
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Dynamically set choices for package based on selected gig
        if 'gig' in self.data:
            try:
                gig_id = int(self.data.get('gig'))
                self.fields['package'].queryset = self.fields['package'].queryset.filter(gig_id=gig_id)
            except (ValueError, TypeError):
                pass

class OrderMilestoneForm(forms.ModelForm):
    class Meta:
        model = OrderMilestone
        fields = ['title', 'description']
        widgets = {
            'title': forms.TextInput(attrs={'class': 'form-control'}),
            'description': forms.Textarea(attrs={
                'class': 'form-control',
                'rows': 3,
                'placeholder': 'Describe the milestone requirements...'
            })
        }

    def clean_title(self):
        title = self.cleaned_data.get('title')
        if len(title) < 5:
            raise forms.ValidationError("Title must be at least 5 characters long.")
        return title

class OrderAttachmentForm(forms.ModelForm):
    class Meta:
        model = OrderAttachment
        fields = ['file_path']
        widgets = {
            'file_path': forms.FileInput(attrs={'class': 'form-control'})
        }

    def clean_file_path(self):
        file = self.cleaned_data.get('file_path')
        if file:
            # Add file size validation (e.g., 10MB limit)
            if file.size > 10 * 1024 * 1024:  # 10MB in bytes
                raise forms.ValidationError("File size must be under 10MB.")
            
            # Add file type validation
            allowed_types = ['pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png', 'zip', 'rar']
            ext = file.name.split('.')[-1].lower()
            if ext not in allowed_types:
                raise forms.ValidationError(f"File type not allowed. Allowed types: {', '.join(allowed_types)}")
        return file

class OrderCancellationForm(forms.ModelForm):
    class Meta:
        model = OrderCancellation
        fields = ['reason', 'is_dispute']
        widgets = {
            'reason': forms.Textarea(attrs={
                'class': 'form-control',
                'rows': 4,
                'placeholder': 'Please provide a detailed reason for cancellation...'
            }),
            'is_dispute': forms.CheckboxInput(attrs={'class': 'form-check-input'})
        }

    def clean_reason(self):
        reason = self.cleaned_data.get('reason')
        if len(reason.strip()) < 20:
            raise forms.ValidationError("Please provide a detailed reason (at least 20 characters).")
        return reason 