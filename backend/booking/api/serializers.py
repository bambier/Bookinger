from booking.models import Epoch, Reservation, Service
from drf_dynamic_fields import DynamicFieldsMixin
from rest_framework.serializers import ModelSerializer

# Serializers


class EpochSerializer(DynamicFieldsMixin, ModelSerializer):

    class Meta:
        model = Epoch
        fields = "__all__"


class ReservationSerializer(DynamicFieldsMixin, ModelSerializer):

    class Meta:
        model = Reservation
        fields = "__all__"


class ServiceSerializer(DynamicFieldsMixin, ModelSerializer):

    class Meta:
        model = Service
        fields = "__all__"
