from django.contrib import admin
from solo.admin import SingletonModelAdmin
from config.models import Setting


# Register your models here.


admin.site.register(Setting, SingletonModelAdmin)
