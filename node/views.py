from os import name
from django.shortcuts import render
from django.views.generic import TemplateView
from django.core.serializers import serialize
from django.http import HttpResponse
from .models import Data_1Hour,Data_10min,Water_Node,Static_Nodes,Borewell_Node


from data_water.views import datalatestall as waterdatalatestall
from data_water.views import graph_data as water_graph_data
from data_water.views import flowchange as waterflowchange

import json

#######
#from data_water.views import fetch_data_static_node, fetch_borewell_data
from data_water.views import static_data_all,borewell_data_all,graph_data_tank,graph_data_borewell

print("--------------------------------------------------------------------------")
# Create your views here.
class HomePageView(TemplateView):
    template_name = 'index.html'

FIELDS = 'fields'
NAME = 'name'
NODEID = 'nodeID'
COORDS = 'coordinates'
COORD = 'coordinate'
LOCATION = 'location'
PARAMS = 'parameters'
IIIT = 'iiit'
AIRVEDA = 'airveda'
LATESTAIRVEDA = 'latestairveda'
LATESTIIIT = 'latestiiit'
DATAAIRVEDA = 'dataairveda'
DATAIIIT = 'dataiiit'
AQI = 'aqi'
NO2 = 'no2'
NH3 = 'nh3'
CO = 'co'
PM25 = 'pm25'
PM10 = 'pm10'
TEMPERATURE = 'temperature'
HUMIDITY = 'humidity'
TYPE = 'type'

params = [AQI, NO2, NH3, CO, PM10, PM25, TEMPERATURE, HUMIDITY,'flowrate','totalflow','pressure','pressurevoltage','isanalog','water_level', 'temp', 'curr_volume','totalvolume','waterlevel']

WATER = 'water'
LATESTWATER = 'latestwater'
DATAWATER = 'datawater'
FLOWCHANGEWATER = 'flowchangewater'
STATICNODES = 'staticnodes'

####
BOREWELLNODES = 'borewellnodes'
TANK_DATA = 'tankdata'
BOREWELL_DATA = 'borewelldata'
DATA_TANKGRAPH = 'datatankgraph'
DATA_BOREWELLGRAPH = 'databorewellgraph'

####
def get_parameters(fields):
    parameters = []
    for param in params:
        if param in fields and fields[param]:
            parameters.append(param)
    return parameters

def get_data_point(elem):
    fields = elem[FIELDS]
    # print(fields)
    cood = fields[COORDS].split("(")[1].split(")")[0]
    cood = [float(cood.split(" ")[1]),float(cood.split(" ")[0])]
    # param_ids = fields[PARAMS]
    parameters = get_parameters(fields)
    return {
        NAME:fields[NAME],\
        LOCATION:fields[LOCATION],
        COORDS:cood,
        PARAMS: parameters
    }

def get_static_data(elem):
    fields = elem[FIELDS]
    # print(fields)
    cood = fields[COORDS].split("(")[1].split(")")[0]
    coordi = [float(cood.split(" ")[1]),float(cood.split(" ")[0])]
    # param_ids = fields[PARAMS]
    return {
        NAME:fields[NAME],
        LOCATION:fields[LOCATION],
        COORDS:coordi,
        TYPE:fields[TYPE]

        # 23/05/23

    }

#############

#############
def nodes_data(request):

    waterdata = serialize('json',Water_Node.objects.filter(visibility = True))
    # print("Before ",waterdata)
    water=[]
    for elem in json.loads(waterdata):
        water.append(get_data_point(elem))
    #print("After", water)

    static_data = serialize('json',Static_Nodes.objects.filter(visibility = True))
    # print(static_data)
    static_points = []
    for elem in json.loads(static_data):
        static_points.append(get_data_point(elem))
    # print(static_data_all())

    borewell_data = serialize('json',Borewell_Node.objects.filter(visibility = True))
    borewell_points = []
    for elem in json.loads(borewell_data):
        borewell_points.append(get_data_point(elem))


    context={
        WATER:json.dumps(water),
        LATESTWATER:json.dumps(waterdatalatestall()),
        DATAWATER:json.dumps(water_graph_data()),
        FLOWCHANGEWATER:json.dumps(waterflowchange()),
        STATICNODES:json.dumps(static_points),
        #
        BOREWELLNODES:json.dumps(borewell_points),
        TANK_DATA:json.dumps(static_data_all()),
        BOREWELL_DATA:json.dumps(borewell_data_all()),
        DATA_TANKGRAPH:json.dumps(graph_data_tank()),
        DATA_BOREWELLGRAPH:json.dumps(graph_data_borewell()),
    }
    # print(graph_data_borewell())
    return render(request,'index.html',context)

def data_waterC(request):
    waterdata = serialize('json',Water_Node.objects.filter(visibility = True))
    # print("Before ",waterdata)
    water=[]
    for elem in json.loads(waterdata):
        water.append(get_data_point(elem))
    return HttpResponse(json.dumps(water),content_type='json')

def data_latestwaterC(request):
    return HttpResponse(json.dumps(water_graph_data()), content_type='json')

def data_flowchangewaterC(request):
    return HttpResponse(json.dumps(waterflowchange()), content_type='json')

def data_staticnodesC(request):
    static_data = serialize('json',Static_Nodes.objects.filter(visibility = True))
    # print(static_data)
    static_points = []
    for elem in json.loads(static_data):
        static_points.append(get_data_point(elem))
    return HttpResponse(json.dumps(static_points), content_type='json')

def data_borewellnodesC(request):
    borewell_data = serialize('json',Borewell_Node.objects.filter(visibility = True))
    borewell_points = []
    for elem in json.loads(borewell_data):
        borewell_points.append(get_data_point(elem))
    return HttpResponse(json.dumps(borewell_points), content_type='json')

def data_tankdataC(request) :
    return HttpResponse(json.dumps(static_data_all()), content_type='json')

def data_borewellgraphC(request):
    return HttpResponse(json.dumps(graph_data_borewell()), content_type='json')

def data(request):
    data=serialize('json',Data_10min.objects.all())
    return HttpResponse(data,content_type='json')

