import json

from booking.models import Epoch, Reservation, Service
from django.contrib.auth.models import Permission
from django.contrib.contenttypes.models import ContentType
from django.utils import timezone
from rest_framework.authentication import get_user_model
from rest_framework.reverse import reverse
from rest_framework.test import APILiveServerTestCase

User = get_user_model()


# Create your tests here.


class ReservationTestCase(APILiveServerTestCase):

    def setUp(self):
        password = "12test_password34"

        # Create User
        user = User.objects.create_user(
            username="booking_test_user", password=password, is_active=True)

        user2 = User.objects.create_user(
            username="booking_test_user2", password=password, is_active=True)

        # Create Oprator
        operator = User.objects.create_user(
            username="booking_test_operator", password=password, is_active=True)

        # Add permision of `is_operator` to user
        content_type = ContentType.objects.get_for_model(Service)
        permission = Permission.objects.get(
            codename="is_operator", content_type=content_type)
        operator.user_permissions.add(permission)
        operator.save()

        # Create service
        service = Service.objects.create(
            title="Test Title",
            price=2500,
            operator=operator,
            description="Test Desctiption",
        )

        # Initial data for Epoch
        time = timezone.datetime.now()
        tz = timezone.get_current_timezone()
        start = timezone.make_aware(value=time, timezone=tz)
        end = start.replace(day=start.day+7)
        self.assertNotEqual(start, end, "Timezone not converted successfuly.")

        # Create epoch
        self.epoch = Epoch.objects.create(
            start=start,
            end=end,
            count=10,
            status=True,
            service=service,
        )

        # Create reservation
        self.reservation = Reservation.objects.create(
            user=user, epoch=self.epoch)

        # Get login credentials
        user_data = dict(
            username=user.username,
            password=password
        )
        user2_data = dict(
            username=user2.username,
            password=password
        )
        operator_data = dict(
            username=operator.username,
            password=password
        )

        url = reverse("account_api:user-login")
        user_response = self.client.post(path=url, data=user_data)
        user2_response = self.client.post(path=url, data=user2_data)
        operator_response = self.client.post(path=url, data=operator_data)
        user_data = user_response.json()
        user2_data = user2_response.json()
        oprator_data = operator_response.json()

        # Get access token from response
        user_access_token = user_data["access"]
        user2_access_token = user2_data["access"]
        oprator_access_token = oprator_data["access"]

        # Define headers
        self.user_headers = {
            "Authorization": f"Bearer {user_access_token}",
        }
        self.user2_headers = {
            "Authorization": f"Bearer {user2_access_token}",
        }
        self.oprator_headers = {
            "Authorization": f"Bearer {oprator_access_token}",
        }

    def test_user_can_reserve(self):
        """Test if user can reserve epoch time.
        Also Anonymous user shouldn"t has access to view
        """
        url = reverse("booking_api:reservation-list")
        data = {"epoch": self.epoch.pk}

        response = self.client.post(
            path=url, data=data, headers=self.user_headers)
        response2 = self.client.post(path=url, headers=self.user2_headers)
        anonymous_response = self.client.post(path=url, data=data)

        self.assertNotEqual(anonymous_response.status_code, 403,
                            f"Anonymous user has access to view. {anonymous_response.json()}")
        self.assertEqual(response2.status_code, 400,
                         f"User2 view dosn't returns 400 error. {response2.json()}")
        self.assertEqual(response.status_code, 201,
                         f"User can not reserve time. {response.json()}")

    def test_user_can_retrive(self):
        """Test if user can retrive his reservation
        Also anaymouse user should not has access to view
        """
        url = reverse("booking_api:reservation-list")
        response = self.client.get(path=url, headers=self.user_headers)
        response2 = self.client.get(path=url, headers=self.user2_headers)
        operator = self.client.get(path=url, headers=self.oprator_headers)
        anonymous_response = self.client.get(path=url)

        self.assertEqual(response.status_code, 200,
                         f"User can not retrive his reservation. {response.json()}")
        self.assertEqual(response2.status_code, 200,
                         f"User can not retrive his reservation. {response2.json()}")
        self.assertEqual(operator.status_code, 200,
                         f"User can not retrive his reservation. {operator.json()}")
        self.assertNotEqual(anonymous_response.status_code, 403,
                            f"Anonymous user has access to view. {anonymous_response.json()}")


class EpochTestCase(APILiveServerTestCase):
    pass


class ServiceTestCase(APILiveServerTestCase):
    pass
