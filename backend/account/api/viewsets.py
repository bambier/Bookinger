from account.api.permissions import AccountPermission
from account.api.serializers import (AccessTokenSerializer,
                                     AccountActivationSerializer,
                                     AccountCreationSerializer,
                                     RefreshTokenRefreshSerializer,
                                     UserSerializer)
from account.token import TokenGenerator
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from django.core.mail import EmailMessage
from django.shortcuts import get_object_or_404
from django.template.loader import render_to_string
from django.utils.encoding import force_bytes, force_str
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from django.utils.translation import gettext_lazy as _
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from rest_framework_simplejwt.views import (TokenObtainPairView,
                                            TokenRefreshView)

User = get_user_model()


# Codes here


class UserViewSet(ModelViewSet):
    queryset = User.objects.all()
    search_fields = ('username', 'first_name', 'last_name', )
    permission_classes = (AccountPermission,)
    serializer_class = UserSerializer

    def get_object(self, *args, **kwargs):
        filterset = self.kwargs.get("pk", None)
        try:
            obj = get_object_or_404(User, pk=int(filterset))
        except:
            obj = get_object_or_404(User, username=filterset)

        return obj

    def get_serializer_class(self, *args, **kwargs):
        if self.action == 'create':
            return AccountCreationSerializer
        elif self.get_view_name() == 'Activate':
            return AccountActivationSerializer
        elif self.get_view_name() == 'Login':
            return AccessTokenSerializer
        elif self.get_view_name() == 'Refresh':
            return RefreshTokenRefreshSerializer

        return super().get_serializer_class(*args, **kwargs)

    @action(methods=['GET',], detail=False)
    def profile(self, request, *args, **kwargs):
        data = self.get_serializer(request.user)
        headers = self.get_success_headers()
        return Response(data.data, status=status.HTTP_200_OK, headers=headers)

    def partial_update(self, request, *args, **kwargs):
        request.data._mutable = True
        if not request.user.has_perm("account.is_admin"):
            request.data.pop("is_superuser")
            request.data.pop("is_staff")
            request.data.pop("user_permissions")
            request.data.pop("groups")

        request.data._mutable = False

        return super().partial_update(request, *args, **kwargs)

    def create(self, request, *args, **kwargs):
        data: dict = request.data
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)

        username = serializer.data['username']
        email = serializer.data['email']
        password = serializer.data['password']

        try:
            validate_password(password)
        except ValidationError as error:
            return Response(
                data={
                    'message': error
                },
                status=status.HTTP_406_NOT_ACCEPTABLE,
                exception=True,
            )

        user = User.objects.create_user(
            username=username,
            email=email,
            password=password,
            is_active=False,
        )

        mail_subject = _('Account Activation')
        message = render_to_string('email/account_activation.html', {
            'user': user,
            'uid': urlsafe_base64_encode(force_bytes(user.pk)),
            'token': TokenGenerator().make_token(user),
        })
        email = EmailMessage(
            mail_subject, message, to=[email]
        )
        email.send()
        headers = self.get_success_headers()
        return Response(data={'message': _('Account created. Check your email to activate it.')}, status=status.HTTP_201_CREATED, headers=headers)

    @action(methods=['POST'], detail=False)
    def activate(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        uidb64 = serializer.data['uidb64']
        token = serializer.data['token']
        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid)
            if (TokenGenerator().check_token(user, token)):
                user.is_active = True
                user.save()
                headers = self.get_success_headers()
                return Response(data={'msg': _('Activated')}, status=status.HTTP_200_OK, headers=headers)
        except:
            pass

        return Response(data={'msg': _('Invalid Link.')}, status=status.HTTP_406_NOT_ACCEPTABLE)

    @action(methods=['POST'], detail=False)
    def login(self, request, *args, **kwargs):
        return TokenObtainPairView.post(self, request, *args, **kwargs)

    @action(methods=['POST'], detail=False)
    def refresh(self, request, *args, **kwargs):
        return TokenRefreshView.post(self, request, *args, **kwargs)
