from django.contrib import admin
from .models import TransitPassApplication, State, District, TransitPass


admin.site.register(State)
admin.site.register(District)
admin.site.register(TransitPassApplication)
admin.site.register(TransitPass)