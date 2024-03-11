from booking.api.viewsets import (EpochViewSet, ReservationViewSet,
                                  ServiceViewSet)
from django.urls import include, path
from rest_framework.routers import DefaultRouter

# Routes

router = DefaultRouter()

router.register('epoch', EpochViewSet, 'epoch')
router.register('reservation', ReservationViewSet, 'reservation')
router.register('service', ServiceViewSet, 'service')


app_name = 'booking_api'
urlpatterns = [
    path('', include(router.urls)),
]
