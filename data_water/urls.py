from django.conf.urls import include
from django.conf.urls.static import static
from django.conf import settings
from django.urls import re_path as url
from data_water.views import data, data_static, data_borewell, data_tank, image_upload
from node.views  import data_waterC, data_latestwaterC, data_flowchangewaterC, data_staticnodesC, data_borewellnodesC, data_borewellgraphC, data_tankdataC

urlpatterns = [
    #all water(meter) nodes general
    url(r'^water/waterminutesdatas/$',data,name='waterdataurl'),
    #all tanks/static general
    url(r'^water/tankerdata/$',data_static,name='tankdataurl'),
    #all borewell general
    url(r'^water/borewelldata/$',data_borewell,name='borewelldataurl'),
    #graph data for tanks/static nodes
    url(r'^water/tankdata/$', data_tank, name='tank_graph_url'),
    #co-ordinates for water(meter) nodes
    url(r'^water/waterC/$', data_waterC, name='waterC'),
    #graph data for water(meter) nodes
    url(r'^water/latestwaterC/$', data_latestwaterC, name='latestwaterC'),
    #flowchangewater
    url(r'^water/flowchangewaterC/$', data_flowchangewaterC, name='flowchangewaterC'),
    #co-ordinates of static nodes/tanks
    url(r'^water/staticnodesC/$', data_staticnodesC, name='staticnodesC'),
    #co-ordinates for borewell
    url(r'^water/borewellnodesC/$', data_borewellnodesC, name='borewellnodesC'),
    #graph for borewell
    url(r'^water/borewellgraphC/$', data_borewellgraphC, name='borewellgraphC'),
    #image upload
    url(r'^water/upload/$', image_upload, name='image_upload'),
    #try
    url(r'^water/staticDataAll/$', data_tankdataC, name='try')
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
