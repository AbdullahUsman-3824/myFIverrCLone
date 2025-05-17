from django import forms
from .models import Category, SubCategory, Gig, GigPackage, GigFAQ, GigGallery, SavedGig

class CategoryForm(forms.ModelForm):
    class Meta:
        model = Category
        fields = ['name', 'description']
        widgets = {
            'name': forms.TextInput(attrs={'class': 'form-control'}),
            'description': forms.Textarea(attrs={'class': 'form-control', 'rows': 3})
        }

class SubCategoryForm(forms.ModelForm):
    class Meta:
        model = SubCategory
        fields = ['category', 'name']
        widgets = {
            'category': forms.Select(attrs={'class': 'form-control'}),
            'name': forms.TextInput(attrs={'class': 'form-control'})
        }

class GigForm(forms.ModelForm):
    class Meta:
        model = Gig
        fields = [
            'title', 'description', 'category', 'subcategory',
            'delivery_time', 'tags', 'thumbnail_image', 'status'
        ]
        widgets = {
            'title': forms.TextInput(attrs={'class': 'form-control'}),
            'description': forms.Textarea(attrs={'class': 'form-control', 'rows': 5}),
            'category': forms.Select(attrs={'class': 'form-control'}),
            'subcategory': forms.Select(attrs={'class': 'form-control'}),
            'delivery_time': forms.NumberInput(attrs={'class': 'form-control'}),
            'tags': forms.TextInput(attrs={'class': 'form-control'}),
            'thumbnail_image': forms.FileInput(attrs={'class': 'form-control'}),
            'status': forms.Select(attrs={'class': 'form-control'})
        }

    def clean_tags(self):
        tags = self.cleaned_data.get('tags')
        if tags:
            # Convert comma-separated tags to list and clean
            tag_list = [tag.strip() for tag in tags.split(',') if tag.strip()]
            return ','.join(tag_list)
        return tags

class GigPackageForm(forms.ModelForm):
    class Meta:
        model = GigPackage
        fields = [
            'package_name', 'description', 'price',
            'number_of_revisions', 'delivery_days'
        ]
        widgets = {
            'package_name': forms.Select(attrs={'class': 'form-control'}),
            'description': forms.Textarea(attrs={'class': 'form-control', 'rows': 3}),
            'price': forms.NumberInput(attrs={'class': 'form-control'}),
            'number_of_revisions': forms.NumberInput(attrs={'class': 'form-control'}),
            'delivery_days': forms.NumberInput(attrs={'class': 'form-control'})
        }

    def clean_price(self):
        price = self.cleaned_data.get('price')
        if price <= 0:
            raise forms.ValidationError("Price must be greater than zero.")
        return price

class GigFAQForm(forms.ModelForm):
    class Meta:
        model = GigFAQ
        fields = ['question', 'answer']
        widgets = {
            'question': forms.Textarea(attrs={'class': 'form-control', 'rows': 2}),
            'answer': forms.Textarea(attrs={'class': 'form-control', 'rows': 3})
        }

class GigGalleryForm(forms.ModelForm):
    class Meta:
        model = GigGallery
        fields = ['media_type', 'media_url']
        widgets = {
            'media_type': forms.Select(attrs={'class': 'form-control'}),
            'media_url': forms.FileInput(attrs={'class': 'form-control'})
        }

    def clean_media_url(self):
        media_url = self.cleaned_data.get('media_url')
        media_type = self.cleaned_data.get('media_type')
        
        if media_url:
            ext = media_url.name.split('.')[-1].lower()
            if media_type == 'image' and ext not in ['jpg', 'jpeg', 'png', 'gif']:
                raise forms.ValidationError("Only image files (jpg, jpeg, png, gif) are allowed for image type.")
            elif media_type == 'video' and ext not in ['mp4', 'avi', 'mov']:
                raise forms.ValidationError("Only video files (mp4, avi, mov) are allowed for video type.")
        return media_url

class SavedGigForm(forms.ModelForm):
    class Meta:
        model = SavedGig
        fields = ['action']
        widgets = {
            'action': forms.Select(attrs={'class': 'form-control'})
        } 