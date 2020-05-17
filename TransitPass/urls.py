from django.urls import path
from . import views


urlpatterns = [
    path('apply/', views.FillPassApplication, name='transit-pass-application-form'),
]