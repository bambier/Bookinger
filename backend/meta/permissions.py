from rest_framework.permissions import SAFE_METHODS, BasePermission


class IsAdminOr404Forbidden(BasePermission):

    def has_permission(self, request, view):  # GET / POST (LIST / CREATE)
        return bool(request.user and request.user.has_perm("account.is_admin"))

    # GET / PATCH / PUT / DELETE (RETRIEVE / UPDATE / PARTIAL UPDATE / DELETE)
    def has_object_permission(self, request, view, obj):
        return bool(request.user and request.user.has_perm("account.is_admin"))


class IsAdminOrReadOnly(BasePermission):

    def has_permission(self, request, view):  # GET / POST (LIST / CREATE)
        return bool(request.user and request.user.has_perm("account.is_admin") or request.method in SAFE_METHODS)

    # GET / PATCH / PUT / DELETE (RETRIEVE / UPDATE / PARTIAL UPDATE / DELETE)
    def has_object_permission(self, request, view, obj):
        return bool(request.user and request.user.has_perm("account.is_admin") or request.method in SAFE_METHODS)


class IsSafeOr404Forbidden(BasePermission):

    def has_permission(self, request, view):  # GET / POST (LIST / CREATE)
        return bool(request.method in SAFE_METHODS)

    # GET / PATCH / PUT / DELETE (RETRIEVE / UPDATE / PARTIAL UPDATE / DELETE)
    def has_object_permission(self, request, view, obj):
        return bool(request.method in SAFE_METHODS)
