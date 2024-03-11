from django.core.exceptions import ValidationError
from django.utils.timezone import datetime
from django.utils.translation import gettext_lazy as _

# Validators


def is_date_expired(value: datetime):
    """Raise an error if date is expired and past"""
    if value <= datetime.now():
        raise ValidationError(_('Date is expired.'))
