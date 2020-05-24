from django.urls import path
from . import views


urlpatterns = [
    path('apply/', views.FillPassApplication, name='transit-pass-application-form'),

    path('view-application-list/', views.DisplayApplicationList, name='view-application-list'),

    path('view-application/<int:appln_id>/', views.DisplayIndividualApplication, name='view-individual-application'),

    path('check-application-status/', views.CheckApplicationStatus, name='check-application-status'),

    path('check-pass-validity/', views.CheckPassValidity, name='check-pass-validity'),
]