from booking.models import Epoch, Reservation, Service
from django.contrib import admin

# Register your models here.


@admin.register(Epoch)
class Epoch(admin.ModelAdmin):
    pass


@admin.register(Reservation)
class Reservation(admin.ModelAdmin):
    pass


@admin.register(Service)
class Service(admin.ModelAdmin):
    pass
