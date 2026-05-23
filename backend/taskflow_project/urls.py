from django.contrib import admin
from django.urls import path, include
from django.views.generic import TemplateView
from django.views.static import serve
from django.conf import settings
import os

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('taskflow_api.urls')),
     path('', TemplateView.as_view(template_name='index.html')),
]


urlpatterns += [
    path('css/<path:path>', serve, {'document_root': os.path.join(settings.BASE_DIR, '../frontend/css')}),
    path('js/<path:path>', serve, {'document_root': os.path.join(settings.BASE_DIR, '../frontend/js')}),
]