from django.contrib.auth import get_user_model
from drf_dynamic_fields import DynamicFieldsMixin
from rest_framework import serializers
from rest_framework_simplejwt.serializers import (TokenObtainPairSerializer,
                                                  TokenRefreshSerializer)


User = get_user_model()


class UserSerializer(DynamicFieldsMixin, serializers.ModelSerializer):

    class Meta:
        model = User
        exclude = (
            'password',
            'last_login',
            'date_joined',
        )


class AccountCreationSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = (
            'username',
            'password',
            'email',
        )


class AccessTokenSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        token['is_superuser'] = user.is_superuser
        token['is_staff'] = user.is_staff
        token['username'] = user.username
        token['user_permissions'] = [
            perm.codename for perm in user.user_permissions.all()]
        token['id'] = user.id

        return token


class RefreshTokenRefreshSerializer(TokenRefreshSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        token['is_superuser'] = user.is_superuser
        token['is_staff'] = user.is_staff
        token['username'] = user.username
        token['user_permissions'] = [
            perm.codename for perm in user.user_permissions.all()]
        token['id'] = user.id

        return token


class AccountActivationSerializer(serializers.Serializer):
    uidb64 = serializers.CharField()
    token = serializers.CharField()
