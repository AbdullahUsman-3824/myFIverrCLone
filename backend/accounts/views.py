from .models import UserProfile
from django.shortcuts import render
from django.urls import reverse
from django.http import HttpResponseRedirect

def login_view(request):
    return render(request, 'accounts/login.html')

def register_view(request):
    return render(request, 'accounts/register.html')

# class RegisterView(CreateView):
#     model = UserProfile
#     form_class = UserCreationForm
#     template_name = 'registration/register.html'
#     success_url = reverse_lazy('login')

#     def form_valid(self, form):
#         response = super().form_valid(form)
#         messages.success(self.request, 'Registration successful! Please check your email to verify your account.')
#         return response

#     def form_invalid(self, form):
#         messages.error(self.request, 'Registration failed. Please correct the errors below.')
#         return super().form_invalid(form)

def createDummyUser():
    # This function creates a dummy user for testing purposes
    user = UserProfile.objects.create_user(username='testuser', email='test@example.com', password='password')
    user.is_buyer = True
    user.is_seller = False
    user.save()

# You can now access these fields
    print(user.is_buyer)  # Output: True
    print(user.is_seller)  # Output: False

# def register_view(request):
#     if request.method == 'POST':
#         form = UserCreationForm(request.POST)
#         if form.is_valid():
#             form.save()
#             messages.success(request, 'Account created successfully! You can now login.')
#             return redirect('login')
#     else:
#         form = UserCreationForm()
#     return render(request, 'registration/register.html', {'form': form})