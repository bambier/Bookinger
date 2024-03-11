from django.db import models
from django.utils.translation import gettext_lazy as _
from solo.models import SingletonModel

# Create your models here.


class Setting(SingletonModel):
    site_name = models.CharField(verbose_name=_(
        'Site name'), max_length=150, blank=True, null=True)
    logo = models.ImageField(verbose_name=_(
        'Logo'), upload_to='public/settings/', blank=True, null=True)

    class Meta:
        verbose_name = _('Setting')
        verbose_name_plural = _('Settings')
