from django.contrib.auth.models import AbstractUser
from django.contrib.auth.models import UserManager as AbstractUserManager
from django.db import models
from django.utils.translation import gettext_lazy as _


# Create your models here.


class UserManager(AbstractUserManager):
    pass


class User(AbstractUser):

    objects = UserManager()

    class Meta:
        permissions = (
            ("is_admin", _("Is user an admin?")),
        )
