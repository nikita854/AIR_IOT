from django.conf.urls import include
from django.urls import re_path as url
from node.views import HomePageView, data, nodes_data

urlpatterns = [
    url(r'^water/$',nodes_data,name='home'),
]