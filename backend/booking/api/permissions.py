from rest_framework.permissions import SAFE_METHODS, BasePermission

# Permisations


class ServicePermission(BasePermission):

    def has_permission(self, request, view):
        return bool(
            request.method in SAFE_METHODS or
            request.user.has_perm('booking.is_operator') or
            request.user.has_perm("account.is_admin")
        )

    def has_object_permission(self, request, view, obj):
        user = request.user
        return bool(
            request.method in SAFE_METHODS or
            (user.has_perm('booking.is_operator') and obj.operator == user) or
            user.has_perm("account.is_admin")
        )


class EpochPermission(BasePermission):

    def has_permission(self, request, view):
        return bool(
            request.method in SAFE_METHODS or
            request.user.has_perm('booking.is_operator') or
            request.user.has_perm("account.is_admin")
        )

    def has_object_permission(self, request, view, obj):
        user = request.user
        return bool(
            request.method in SAFE_METHODS or
            (user.has_perm('booking.is_operator') and obj.service.operator == user) or
            user.has_perm("account.is_admin")
        )


class ReservationPermission(BasePermission):

    def has_permission(self, request, view):
        user = request.user
        return bool(
            user.has_perm("account.is_admin") or
            user.has_perm('booking.is_operator') or
            user
        )

    def has_object_permission(self, request, view, obj):
        user = request.user
        return bool(
            user.has_perm("account.is_admin") or
            (user.has_perm('booking.is_operator') and obj.epoch.service.operator == user) or
            obj.user == user
        )
