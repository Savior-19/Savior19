from django.contrib import admin
from .models import CustomUser#, DistrictOfficialProfile, StateOfficialProfile
from django.contrib.auth.admin import UserAdmin
from .forms import CustomUserCreationForm, CustomUserChangeForm 


class CustomUserAdmin(UserAdmin):
    model = CustomUser 
    add_form = CustomUserCreationForm 
    form = CustomUserChangeForm 
    fieldsets = UserAdmin.fieldsets + (
        (None, {'fields': ('role',)}),
    )


admin.site.register(CustomUser, CustomUserAdmin)
"""admin.site.register(DistrictOfficialProfile)
admin.site.register(StateOfficialProfile)"""