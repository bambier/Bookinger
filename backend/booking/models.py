from booking.validators import is_date_expired
from django.db import models
from django.utils.translation import gettext_lazy as _

# Create your models here.


class Service(models.Model):
    """The service that operator provides."""
    title = models.CharField(verbose_name=_(
        'Title'), max_length=100)
    price = models.PositiveSmallIntegerField(verbose_name=_('Price'))
    operator = models.ForeignKey('account.User', verbose_name=_(
        'Operator'), on_delete=models.PROTECT, null=True, blank=True)
    description = models.TextField(verbose_name=_('Description'))

    class Meta:
        verbose_name = _('Service')
        verbose_name_plural = _('Services')
        ordering = ('id',)
        permissions = [
            ('is_operator', _('Is user an operator?')),
        ]


class Epoch(models.Model):
    """The epoch that service is available"""
    start = models.DateTimeField(_("Start"), validators=[is_date_expired])
    end = models.DateTimeField(_("End"), validators=[is_date_expired])
    count = models.PositiveSmallIntegerField(
        default=1, verbose_name=_('Count'))
    status = models.BooleanField(default=True, verbose_name=_('Status'))
    service = models.ForeignKey(
        to=Service, on_delete=models.PROTECT, verbose_name=_('Service'))

    class Meta:
        verbose_name = _('Epoch')
        verbose_name_plural = _('Epochs')
        ordering = ('start', 'end', 'count', 'status', 'id',)
        permissions = [
            ('is_operator', _('Is user an operator?')),
        ]


class Reservation(models.Model):
    """service reservation"""
    user = models.ForeignKey(
        to='account.User', on_delete=models.CASCADE, verbose_name=_('User'), blank=True)
    epoch = models.ForeignKey(
        to=Epoch, on_delete=models.PROTECT, verbose_name=_('Epoch'))

    class Meta:
        verbose_name = _('Reservation')
        verbose_name_plural = _('Reservations')
        ordering = ('id',)
