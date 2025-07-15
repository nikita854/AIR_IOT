from node.models import Water_Node,Static_Nodes,Borewell_Node
from django.shortcuts import render
from django.core.serializers import serialize
from .models import Data_10min,Data_1Hour,current_Static_Node_Data,current_Borewell_Node_Data, Data_1min_Borewell, Data_1min_Tank
from pytz import timezone
import json
from django.http import HttpResponse, JsonResponse
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
###
import os
import requests
from math import pi
from datetime import datetime


# Create your views here.

@csrf_exempt
def image_upload(request):
    if request.method == 'POST' and request.FILES.get('image'):
        try:
            image = request.FILES['image']

            key1 = request.POST.get('key1')

            if not key1:
                return JsonResponse({'status': 'failure', 'message': 'Metadata key is required.'}, status=400)
            
            subfolder_path = os.path.join(settings.MEDIA_ROOT, key1)
            if not os.path.exists(subfolder_path):
                os.makedirs(subfolder_path)
            
            images = sorted(os.listdir(subfolder_path))
            if len(images) >= 5:
                oldest_image = images[0]
                os.remove(os.path.join(subfolder_path, oldest_image))
            
            image_path = os.path.join(subfolder_path, image.name)

            with open(image_path, 'wb+') as destination:
                for chunk in image.chunks():
                    destination.write(chunk)
            
            return JsonResponse({'status': 'success', 'message': f'Image uploaded successfully to {subfolder_path}'})
        except Exception as e:
            return JsonResponse({'status': 'failure', 'message': str(e)}, status=500)
    return JsonResponse({'status': 'failure', 'message': 'Invalid request.'}, status=400)

def data(request):
    # data=serialize('json',Data_10min.objects.all())
    data=datalatestall()
    return HttpResponse(json.dumps(data),content_type='json')

def datalatestall():
    data = Data_10min.objects.all()
    names = []
    for elem in data:
        elem.created_at = elem.created_at.astimezone(timezone('Asia/Kolkata'))
        names.append(elem.node.name)
    json_data = serialize('json',data)
    #print("Before" ,json_data)

    datajson={}
    for idx, elem in enumerate(json.loads(json_data)):
        temp = elem['fields']
        temp['nodeID'] = names[idx]

        created_at_str = elem['fields']['created_at']
        created_at_datetime = datetime.strptime(created_at_str, "%Y-%m-%dT%H:%M:%S%z")  # Convert string to datetime
        formatted_created_at = created_at_datetime.strftime("%d-%m-%Y %H:%M:%S")  # Format datetime
        temp['created_at'] = formatted_created_at

        #print(elem)
        datajson[temp['nodeID']] = temp
    #print("asdasd")
    #print("After",datajson)
    return datajson

def flowchange():
    data = Data_10min.objects.all()
    names = []
    for elem in data:
        elem.created_at = elem.created_at.astimezone(timezone('Asia/Kolkata'))
        names.append(elem.node.name)
    json_data = serialize('json',data)
    #print("Before" ,json_data)

    datajson={}
    datajson_arr = []
    data2json = []
    flowchange = {}

    for idx, elem in enumerate(json.loads(json_data)):
        temp = elem['fields']
        temp['nodeID'] = names[idx]
        #print(elem)
        datajson[temp['nodeID']] = temp
        datajson_arr.append(temp)
    #print("asdasd")
    #print("After",datajson)
    #print(datajson_arr)

    for i in range(2,22):
        temp1 = 0
        temp2 = 0
        if_loop_index = 0
        for j in range(len(datajson_arr)):
            if datajson_arr[j]['node'] == i:
                if_loop_index += 1
                temp_dict = {}
                temp_dict[datajson_arr[j]['node']] = datajson_arr[j]['totalflow']
                data2json.append(temp_dict)

                temp1 = datajson_arr[j]['totalflow']
                flow_change = temp1 - temp2
                temp2 = datajson_arr[j]['totalflow']
        if if_loop_index == 1:
            flow_change = 0
        for j in range(len(datajson_arr)):
            if datajson_arr[j]['node'] == i:
                flowchange[datajson_arr[j]['nodeID']] = abs(flow_change)
        #print()
        #print(flow_change)
        #print()

    #print(data2json)
    #print(flowchange)
    #print()
    #print()
    #print()
    return flowchange

def graph_data():
    datawater={}
    nodes=Water_Node.objects.all()
    for elem in nodes:
        datasingle=[]
        node_name=elem.name
        data_1hour=Data_1Hour.objects.filter(node=elem).order_by('created_at')
        # data_1hour=Data_10min.objects.filter(nodeID=node_name).order_by('created_at')
        for element in data_1hour:
            time_created = element.created_at.astimezone(timezone('Asia/Kolkata'))
            # time_created = element.created_at
            datajson={'created_at':(time_created).strftime("%m/%d/%Y, %H:%M:%S"),
                'flowrate':element.flowrate,
                'totalflow':element.totalflow,
                'pressure':element.pressure,
                'pressurevoltage':element.pressurevoltage,
            }
            datasingle.append(datajson)
        datawater[node_name]=datasingle
    return datawater

#####################################
# 6 / 6 / 23

def static_data_all():
    data = Data_1min_Tank.objects.all()
    names = []
    for elem in data:
        elem.created_at = elem.created_at.astimezone(timezone('Asia/Kolkata'))
        names.append(elem.tanker.name)
    json_data = serialize('json',data)
    #print("Before" ,json_data)

    datajson_static={}
    for idx, elem in enumerate(json.loads(json_data)):
        temp = elem['fields']
        temp['nodeID'] = names[idx]
        #print(elem)

        created_at_str = elem['fields']['created_at']
        try:
            created_at_datetime = datetime.strptime(created_at_str, "%Y-%m-%dT%H:%M:%S.%f%z")
        except ValueError:
        # Attempt to parse without microseconds
            created_at_datetime = datetime.strptime(created_at_str, "%Y-%m-%dT%H:%M:%S%z")

        formatted_created_at = created_at_datetime.strftime("%d-%m-%Y %H:%M:%S")  # Format datetime
        temp['created_at'] = formatted_created_at

        datajson_static[temp['nodeID']] = temp
    #print("asdasd")
    #print("After",datajson_static)
    return datajson_static

def data_static(request):
    # data=serialize('json',Data_10min.objects.all())
    data=static_data_all()
    return HttpResponse(json.dumps(data),content_type='json')

def borewell_data_all():
    data = Data_1min_Borewell.objects.all()
    names = []
    for elem in data:
        elem.created_at = elem.created_at.astimezone(timezone('Asia/Kolkata'))
        # formatted_time = elem.created_at.strftime("%d-%m-%Y %H:%M:%S")
        # elem.created_at = formatted_time
        names.append(elem.borewell.name)
    json_data = serialize('json',data)
    # print("Before" ,json_data)

    datajson_borewell={}
    for idx, elem in enumerate(json.loads(json_data)):
        temp = elem['fields']
        temp['nodeID'] = names[idx]
        #print(elem)

        created_at_str = elem['fields']['created_at']
        try:
            created_at_datetime = datetime.strptime(created_at_str, "%Y-%m-%dT%H:%M:%S.%f%z")
        except ValueError:
        # Attempt to parse without microseconds
            created_at_datetime = datetime.strptime(created_at_str, "%Y-%m-%dT%H:%M:%S%z")
        formatted_created_at = created_at_datetime.strftime("%d-%m-%Y %H:%M:%S")  # Format datetime
        temp['created_at'] = formatted_created_at

        datajson_borewell[temp['nodeID']] = temp
    #print("asdasd")
    # print("After",datajson_borewell)
    return datajson_borewell

def data_borewell(request):
    # data=serialize('json',Data_10min.objects.all())
    data=borewell_data_all()
    return HttpResponse(json.dumps(data),content_type='json')

def data_tank(request):
    data=graph_data_tank()
    return HttpResponse(json.dumps(data),content_type='json')

def graph_data_tank():
    datawater={}
    nodes=Static_Nodes.objects.all()
    for elem in nodes:
        datasingle=[]
        node_name=elem.name
        data_1hour=current_Static_Node_Data.objects.filter(tanker=elem).order_by('created_at')
        # data_1hour=Data_10min.objects.filter(nodeID=node_name).order_by('created_at')
        for element in data_1hour:
            time_created = element.created_at.astimezone(timezone('Asia/Kolkata'))
            # time_created = element.created_at
            datajson={'created_at':(time_created).strftime("%m/%d/%Y, %H:%M:%S"),
                'totalvolume':element.curr_volume,
                'waterlevel':element.water_level,
                'temperature':element.temp,
            }
            datasingle.append(datajson)
        datawater[node_name]=datasingle
    return datawater

def graph_data_borewell():
    datawater={}
    nodes=Borewell_Node.objects.all()
    for elem in nodes:
        datasingle=[]
        node_name=elem.name
        data_1hour=current_Borewell_Node_Data.objects.filter(borewell=elem).order_by('created_at')
        # data_1hour=Data_10min.objects.filter(nodeID=node_name).order_by('created_at')
        for element in data_1hour:
            time_created = element.created_at.astimezone(timezone('Asia/Kolkata'))
            # time_created = element.created_at
            datajson={'created_at':(time_created).strftime("%m/%d/%Y, %H:%M:%S"),
                'waterlevel':element.water_level,
            }
            datasingle.append(datajson)
        datawater[node_name]=datasingle
    return datawater
