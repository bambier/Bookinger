from account.api.serializers import AccessTokenSerializer
from account.token import TokenGenerator
from django.contrib.auth.models import Permission
from django.contrib.contenttypes.models import ContentType
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode
from rest_framework import status
from rest_framework.authentication import get_user_model
from rest_framework.reverse import reverse
from rest_framework.test import APILiveServerTestCase

User = get_user_model()


# Create your tests here.


class UserTestCase(APILiveServerTestCase):

    def setUp(self) -> None:
        self.password = "12test@Password34"
        self.username = "account_test_user"
        self.email = 'my_0_mail@mail.com'

        self.user = User.objects.create_user(
            username=self.username, password=self.password, email=self.email)
        # Add permision of `is_operator` to user
        content_type = ContentType.objects.get_for_model(User)
        permission = Permission.objects.get(
            codename="is_admin", content_type=content_type)
        self.user.user_permissions.add(permission)
        self.user.save()

        refresh = AccessTokenSerializer.get_token(self.user)
        self.refresh = str(refresh)
        self.access = str(refresh.access_token)

        self.uid = urlsafe_base64_encode(force_bytes(self.user.pk))
        self.token = TokenGenerator().make_token(self.user)

    def test_user_can_login(self):
        """Test if user can login successfully with correct credentials
        and banned with fake credentials.
        """
        url = reverse('account_api:user-login')
        res = self.client.post(
            path=url, data={"username": self.username, "password": self.password})
        res_invalid = self.client.post(
            path=url, data={"username": self.username, "password": self.password + "55"})

        self.assertEqual(res.status_code, status.HTTP_200_OK,
                         f'User unable to login. {res.json()}')
        self.assertNotEqual(res_invalid.status_code, status.HTTP_200_OK,
                            f'User able to login even with fake credentials. {res.json()}')

    def test_user_can_register(self):
        """Test if user can register successfully with correct inputs
        and banned with fake inputs.
        """
        url = reverse('account_api:user-list')

        res = self.client.post(path=url, data={
            'username': 'master_tester',
            'password': self.password,
            'email': 'my_1_email@mail.com'
        })
        res_invalid = self.client.post(path=url, data={
            'username': self.username,
            'password': self.password,
            'email': self.email
        })
        res_invalid2 = self.client.post(path=url, data={
            'username': "master_tester2_",
            'password': "ab654321",
            'email': "aa" + self.email
        })

        self.assertEqual(res.status_code, status.HTTP_201_CREATED,
                         f"User neither created nor registed. {res.json()}")
        self.assertEqual(res_invalid.status_code, status.HTTP_400_BAD_REQUEST,
                         f"User created even with conflicting. {res_invalid.json()}")
        self.assertEqual(res_invalid2.status_code, status.HTTP_406_NOT_ACCEPTABLE,
                         f"User created even with invalid data. {res_invalid2.json()}")

    def test_user_can_activate(self):
        """Test if user can activate successfully with correct inputs
        and banned with fake inputs.
        """
        url = reverse('account_api:user-activate')
        res = self.client.post(
            path=url, data={"uidb64": self.uid, "token": self.token})
        res_invalid = self.client.post(
            path=url, data={"uidb64": self.uid, "token": self.token + "565"})

        self.assertEqual(res.status_code, status.HTTP_200_OK,
                         f"User can not activate successfully {res.json()}")
        self.assertEqual(res_invalid.status_code, status.HTTP_406_NOT_ACCEPTABLE,
                         f"User can activate with fale token {res_invalid.json()}")

    def test_user_can_refresh(self):
        """Test if user can refresh the access token successfully with
        correct refresh token and banned with fake refresh token.
        """
        url = reverse('account_api:user-refresh')
        res = self.client.post(path=url, data={"refresh": self.refresh})
        res_invalid = self.client.post(
            path=url, data={"refresh": self.refresh + "55"})

        self.assertEqual(res.status_code, status.HTTP_200_OK,
                         f"User can not refresh token. {res.json()}")
        self.assertNotEqual(res_invalid.status_code, status.HTTP_200_OK,
                            f"User can refresh with fake token. {res.json()}")


# TODO: Add test for serializers