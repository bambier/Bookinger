from django.db import models
from django.utils.translation import gettext_lazy as _


class TimeStamp(models.Model):
    created_at = models.DateTimeField(
        verbose_name=_('Created at'), auto_now_add=True)
    updated_at = models.DateTimeField(
        verbose_name=_('Updated at'), auto_now=True)

    class Meta:
        abstract = True
        ordering = ('-created_at', '-updated_at', '-id',)


class SEO(TimeStamp):
    seo_title = models.CharField(verbose_name=_(
        'Title'), max_length=250, db_index=True, null=True, blank=True)
    seo_description = models.CharField(verbose_name=_(
        'Description'), max_length=250, db_index=True, null=True, blank=True)
    seo_keywords = models.CharField(verbose_name=_(
        'Keywords'), max_length=250, db_index=True, null=True, blank=True)

    class Meta:
        abstract = True
        indexes = (
            models.Index(
                fields=['seo_title', 'seo_keywords', 'seo_description']),
            models.Index(fields=['title'], name='title_idx'),
        )
