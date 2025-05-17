from django import forms
from .models import OrderRating, GigRating

class OrderRatingForm(forms.ModelForm):
    class Meta:
        model = OrderRating
        fields = ['rating', 'review']
        widgets = {
            'rating': forms.NumberInput(attrs={
                'class': 'form-control',
                'min': 1,
                'max': 5,
                'type': 'range'
            }),
            'review': forms.Textarea(attrs={
                'class': 'form-control',
                'rows': 4,
                'placeholder': 'Share your experience with this order...'
            })
        }

    def clean_rating(self):
        rating = self.cleaned_data.get('rating')
        if rating < 1 or rating > 5:
            raise forms.ValidationError("Rating must be between 1 and 5.")
        return rating

    def clean_review(self):
        review = self.cleaned_data.get('review')
        if review and len(review.strip()) < 10:
            raise forms.ValidationError("Review must be at least 10 characters long if provided.")
        return review

class GigRatingForm(forms.ModelForm):
    class Meta:
        model = GigRating
        fields = ['rating', 'review']
        widgets = {
            'rating': forms.NumberInput(attrs={
                'class': 'form-control',
                'min': 1,
                'max': 5,
                'type': 'range'
            }),
            'review': forms.Textarea(attrs={
                'class': 'form-control',
                'rows': 4,
                'placeholder': 'Share your experience with this gig...'
            })
        }

    def clean_rating(self):
        rating = self.cleaned_data.get('rating')
        if rating < 1 or rating > 5:
            raise forms.ValidationError("Rating must be between 1 and 5.")
        return rating

    def clean_review(self):
        review = self.cleaned_data.get('review')
        if review and len(review.strip()) < 10:
            raise forms.ValidationError("Review must be at least 10 characters long if provided.")
        return review 