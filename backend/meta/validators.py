import gzip
import string
from pathlib import Path

from django.core.exceptions import ValidationError
from django.utils.functional import cached_property
from django.utils.translation import gettext_lazy as _


# Validators
class UpperCasePasswordValidator:
    """
    Validate that the password is contains uppercase letter.
    """

    def validate(self, password, user=None):
        if not any(char.isupper() for char in password):
            raise ValidationError(
                _('Password dosn’t contains uppercase letter.'),
                code='password_dosnt_contains_uppercase_letter',
            )

    def get_help_text(self):
        return _("Your password should be contains at least one uppercase letter.")


class LowerCasePasswordValidator:
    """
    Validate that the password is contains lowercase letter.
    """

    def validate(self, password, user=None):
        if not any(char.islower() for char in password):
            raise ValidationError(
                _('Password dosn’t contains lowercase letter.'),
                code='password_dosnt_contains_lowercase_letter',
            )

    def get_help_text(self):
        return _("Your password should be contains at least one lowercase letter.")


class DigitPasswordValidator:
    """
    Validate that the password is contains digit.
    """

    def validate(self, password, user=None):
        if not any(char.isdigit() for char in password):
            raise ValidationError(
                _('Password dosn’t contains digits.'),
                code='password_dosnt_contains_digits',
            )

    def get_help_text(self):
        return _("Your password should be contains at least one digit.")


class SpecialLetterPasswordValidator:
    """
    Validate that the password is contains special letter.
    """

    def validate(self, password, user=None):
        if not any(char in string.punctuation for char in password):
            raise ValidationError(
                _(f'Password dosn’t contains special letter.'),
                code='password_dosnt_contains_special_letter',
            )

    def get_help_text(self):
        return _("Your password should be contains at least one special letter.")


class CommonPasswordValidator:
    """
    Validate that the password is not a common password.

    The password is rejected if it occurs in a provided list of passwords,
    which may be gzipped. The list Django ships with contains 20000 common
    passwords (lowercased and deduplicated), created by Royce Williams:
    https://gist.github.com/roycewilliams/226886fd01572964e1431ac8afc999ce
    The password list must be lowercased to match the comparison in validate().
    """

    @cached_property
    def DEFAULT_PASSWORD_LIST_PATH(self):
        return Path(__file__).resolve().parent / "10-million-password-list-top-1000000.txt.gz"

    def __init__(self, password_list_path=DEFAULT_PASSWORD_LIST_PATH):
        if password_list_path is CommonPasswordValidator.DEFAULT_PASSWORD_LIST_PATH:
            password_list_path = self.DEFAULT_PASSWORD_LIST_PATH
        try:
            with gzip.open(password_list_path, "rt", encoding="utf-8") as f:
                self.passwords = {x.strip() for x in f}
        except OSError:
            with open(password_list_path) as f:
                self.passwords = {x.strip() for x in f}

    def validate(self, password, user=None):
        if password.lower().strip() in self.passwords:
            raise ValidationError(
                _("This password is too common."),
                code="password_too_common",
            )

    def get_help_text(self):
        return _("Your password can’t be a commonly used password.")
