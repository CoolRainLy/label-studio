from django.urls import include, path

from . import views
from .api import *

app_name = 'mju_auth'

_urlpatterns = [
    path('', views.auth_list, name='auth-index'),
]

_api_urlpatterns = [
    path('groups/', GroupListCreateAPIView.as_view(), name='group-list-create'),
    path('groups/<int:pk>/', GroupRetrieveUpdateDestroyAPIView.as_view(), name='group-detail'),
    path('permissions/', PermissionListCreateAPIView.as_view(), name='permission-list-create'),
    path('permissions/<int:pk>/', PermissionRetrieveUpdateDestroyAPIView.as_view(), name='permission-detail'),
    path('content-type/', ContentTypeListAPIView.as_view(), name='content-type-list'),
]

urlpatterns = [
    path('auth/', include(_urlpatterns)),
    path('api/auth/', include((_api_urlpatterns, app_name), namespace='api')),
]