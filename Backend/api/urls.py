from django.urls import path
from .views import AdminLoginView, RolLoginView

urlpatterns = [
    path('login/admin/', AdminLoginView.as_view()),
    path('login/rol/', RolLoginView.as_view()),
]
