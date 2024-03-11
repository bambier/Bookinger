from rest_framework.permissions import SAFE_METHODS, BasePermission


class AccountPermission(BasePermission):

    def has_permission(self, request, view):  # GET / POST (LIST / CREATE)
        return bool(
            (request.user.is_authenticated and request.user.has_perm("account.is_admin"))
            or request.method == 'POST'
            or view.name in ('activate', 'login', 'refresh')
        )

    # GET / PATCH / PUT / DELETE (RETRIEVE / UPDATE / PARTIAL UPDATE / DELETE)
    def has_object_permission(self, request, view, obj):
        return bool(
            request.method in SAFE_METHODS
            or request.user.has_perm("account.is_admin")
            or request.user == obj
        )
