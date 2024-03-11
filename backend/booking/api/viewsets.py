from booking.api.permissions import (EpochPermission, ReservationPermission,
                                     ServicePermission)
from booking.api.serializers import (EpochSerializer, ReservationSerializer,
                                     ServiceSerializer)
from booking.models import Epoch, Reservation, Service
from django.db.models import Q
from rest_framework.permissions import (IsAuthenticated,
                                        IsAuthenticatedOrReadOnly)
from rest_framework.viewsets import ModelViewSet

# ViewSet


class ServiceViewSet(ModelViewSet):
    permission_classes = (IsAuthenticatedOrReadOnly, ServicePermission,)
    serializer_class = ServiceSerializer
    queryset = Service.objects.all()

    def get_serializer_class(self):
        return ServiceSerializer


class EpochViewSet(ModelViewSet):
    permission_classes = (IsAuthenticatedOrReadOnly, EpochPermission,)
    serializer_class = EpochSerializer
    queryset = Epoch.objects.all()

    def get_serializer_class(self):
        return EpochSerializer


class ReservationViewSet(ModelViewSet):
    permission_classes = (IsAuthenticated, ReservationPermission,)
    serializer_class = ReservationSerializer

    def get_serializer_class(self):
        return ReservationSerializer

    def get_queryset(self):
        user = self.request.user
        if user.has_perm("account.is_admin"):
            return Reservation.objects.all().order_by('id')
        elif user.has_perm('booking.is_operator'):
            return Reservation.objects.filter(Q(user=user) | Q(epoch__service__operator=user)).order_by('id')
        else:
            return Reservation.objects.filter(user=user).order_by('id')

    def create(self, request):
        data = request.data.copy()  # Create a mutable copy

        # Set 'user' to request user's primary key if not provided
        data.setdefault('user', request.user.pk)

        # Check if the user is neither a superuser nor has the permission 'is_operator'
        if not (request.user.has_perm("account.is_admin") or request.user.has_perm('booking.is_operator')):
            data['user'] = request.user.pk

        # Create a new request with the modified data
        mutable_request = request._request
        mutable_request.data = data

        # Call the superclass method to create the reservation
        return super(ReservationViewSet, self).create(mutable_request)
