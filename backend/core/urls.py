from django.conf import settings
from django.contrib import admin
from django.contrib.sitemaps.views import sitemap
from django.urls import include, path, re_path
from drf_yasg import openapi
from drf_yasg.views import get_schema_view
from rest_framework.permissions import AllowAny

sitemaps = {
}


schema_view = get_schema_view(
    openapi.Info(
        title="Example API",
        default_version='v1',
        description="Example API documentation",
        terms_of_service="https://Example.com/terms",
        contact=openapi.Contact(email="contact@Example.com"),
        license=openapi.License(name="CC BY-NC 4.0"),
    ),
    public=True,
    permission_classes=[AllowAny],
)


urlpatterns = [
    path('admin/', admin.site.urls),


    path('sitemap.xml', sitemap, {'sitemaps': sitemaps},
         name='django.contrib.sitemaps.views.sitemap'),



    path('api/booking/', include('booking.api.urls', namespace='booking_api')),
    path('api/account/', include('account.api.urls', namespace='account_api')),



    re_path(route=r'^swagger/$',
            view=schema_view.with_ui('swagger', cache_timeout=0),
            name='schema-swagger-ui',
            ),
]

if settings.DEBUG:
    from django.conf.urls.static import static
    urlpatterns += static(settings.STATIC_URL,
                          document_root=settings.STATIC_ROOT)
    urlpatterns += static(settings.MEDIA_URL,
                          document_root=settings.MEDIA_ROOT)
