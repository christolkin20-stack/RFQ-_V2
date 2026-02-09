from django.contrib import admin
from django.urls import path, include
from django.views.generic.base import RedirectView
from django.contrib.staticfiles.storage import staticfiles_storage
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    # Avoid 404 noise in dev tools
    path('favicon.ico', RedirectView.as_view(url=staticfiles_storage.url('rfq/favicon.ico'))),
    path('admin/', admin.site.urls),
    path('', include('rfq.urls')),
]


if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
