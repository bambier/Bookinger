from account.api.viewsets import UserViewSet
from django.urls import include, path
from rest_framework.routers import DefaultRouter

# Routes


router = DefaultRouter()


router.register('user', UserViewSet, basename="user")


app_name = 'account_api'
urlpatterns = [
    path('', include(router.urls)),

]
