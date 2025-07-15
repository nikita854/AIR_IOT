from data_water.models import Data_10min as water_data_10min, Data_1min_Borewell, Data_1min_Tank
from data_water.models import Data_1Hour as water_data_1hr, current_Static_Node_Data,current_Borewell_Node_Data
from requests import get

###########
from node.models import Static_Nodes,Borewell_Node, Water_Node
import json
import requests
from django.utils import timezone
from datetime import datetime, timedelta

pi = 3.1415

def aqiCalculation(pm25,pm10):
    pm25=checkFloat(pm25)
    pm10=checkFloat(pm10)
    if(pm10<=100.0):
        index10 = pm10
    elif(pm10 > 100.0 and pm10 <= 250.0):
        index10 = 100 + ((pm10-100.0)*100.0/150.0)
    elif(pm10 > 250.0 and pm10 <= 350.0):
        index10 = 200 + ((pm10-250.0))
    elif(pm10 > 350.0 and pm10 <= 430.0):
        index10 = 300 + ((pm10-350)*100/80)
    else:
        index10 = 400 + ((pm10-430)*100/80)

    if (pm25 <= 30.0):
        index25 = pm25*50.0/30.0
    elif (pm25 > 30.0 and pm25 <= 60.0):
        index25 = 50.0 + ((pm25-30.0)*50.0/30.0)
    elif (pm25 > 60.0 and pm25 <= 90.0):
        index25 = 100.0 + ((pm25-60.0)*100.0/30.0)
    elif (pm25 > 90.0 and pm25 <= 120.0):
        index25 = 200.0 + ((pm25-90.0)*100.0/30.0)
    elif (pm25 > 120.0 and pm25 <= 250.0):
        index25 = 300.0 + ((pm25-120.0)*100.0/130.0)
    else:
        index25 = 400.0 +((pm25-250.0)*100.0/130.0) 

    if( index10 > index25 ):
        return index10
    else:
        return index25

# check value

def checkFloat(strg):
    try:
        return(round(float(strg), 2))
    except:
        return(-1.0)

def checkInt(strg):
    try:
        return(int(strg))
    except:
        return(-1)

# example url
# https://api.thingspeak.com/channels/944798/feeds.json?api_key=8YB4CCP2H3ULN2TW&average=10
def api_call(url,channelId,name):
    default={
        'channel': {
        'id': channelId, 
        'name': name, 
        'description': 'Prime Splendor', 
        'latitude': '0.0', 
        'longitude': '0.0', 
        'field1': 'PM10', 
        'field2': 'PM2.5', 
        'field3': 'RH', 
        'field4': 'Temperature', 
        'field5': 'CO', 
        'field6': 'NO2', 
        'field7': 'NH3',
        'created_at': '2020-12-23T10:17:29Z', 
        'updated_at': '2021-01-08T12:40:41Z', 
        'last_entry_id': 42697
        }, 
        'feeds': [
            {'created_at': '2021-01-10T10:00:00Z', 
            'field1': None, 
            'field2': None, 
            'field3': None, 
            'field4': None, 
            'field5': None, 
            'field6': None, 
            'field7': None
            }, 
            {'created_at': '2021-01-10T10:10:00Z', 
            'field1': None, 
            'field2': None, 
            'field3': None, 
            'field4': None, 
            'field5': None, 
            'field6': None, 
            'field7': None},  
            ]
        }
    response = get(url)
    if not(response.status_code==200):
        return json.dumps(default)
    return response.text

def map_data(channel, data):
    for key in channel:
        val = channel[key]
        val = str(val).lower()
        val = val.replace('.','')
        channel[key] = val
    dict2 = {}
    for i in range(1,8):
        fld = 'field' + str(i)
        try:
            dict2[channel[fld]] = data[fld]
        except:
            pass  
    dict2['created_at'] = data['created_at']
    keyarray=['pm25','pm10','temperature','humidity','co','no2','nh3','aqi']
    for elem in keyarray:
        if not(elem in dict2.keys()):
            dict2[elem]=-1

    #some nodes humidity is named as RH(relative humidity ) in Think-speak    
    if "rh" in dict2.keys():
        dict2['humidity']=dict2['rh']
    return dict2

def get_object_water_10min(node,data):
    return water_data_10min(node=node,
    created_at=data['created_at'],
    flowrate=checkFloat(data['flowrate']),
    totalflow=checkFloat(data['totalflow']),
    pressure=checkFloat(data['pressure']),
    pressurevoltage=checkFloat(data['pressurevoltage'])
    )

def get_object_water_1hour(node,data):
    return water_data_1hr(node=node,
    created_at=data['created_at'],
    flowrate=checkFloat(data['flowrate']),
    totalflow=checkFloat(data['totalflow']),
    pressure=checkFloat(data['pressure']),
    pressurevoltage=checkFloat(data['pressurevoltage'])
    )

def get_data_from_element(elem, average):
    start="https://api.thingspeak.com/channels/"
    middle="/feeds.json?api_key="
    url = start + str(elem.channelID) 
    url += middle + elem.readAPIKEY + "&average=" + str(average)
    data=api_call(url,elem.channelID,elem.name)
    data = json.loads(data)
    datachannel = data['channel']
    data=data['feeds']
    data=data[len(data)-1]
    data = map_data(datachannel,data)
    return data

def get_data_sp(elem,average):
    start="https://api.thingspeak.com/channels/"
    middle="/feeds.json?api_key="
    url = start + str(elem.channelID) 
    url += middle + elem.readAPIKEY
    data=api_call(url,elem.channelID,elem.name)
    data = json.loads(data)
    datachannel = data['channel']
    data=data['feeds']
    data=data[len(data)-1]
    for key in datachannel:
        val = datachannel[key]
        val = str(val).lower()
        val = val.replace(' ','')
        datachannel[key] = val
    dict2 = {}
    for i in range(1,5):
        fld = 'field' + str(i)
        try:
            dict2[datachannel[fld]] = data[fld]
        except:
            pass  
    dict2['created_at'] = data['created_at']
    keyarray=['flowrate','totalflow','pressure','pressurevoltage']
    for element in keyarray:
        if not(element in dict2.keys()):
            dict2[element]=-1
    return dict2

def get_data_borewell(elem):
    start="https://api.thingspeak.com/channels/"
    middle="/feeds.json?api_key="
    url = start + str(elem.channelID) 
    url += middle + elem.readAPIKEY

    data=api_call(url,elem.channelID,elem.name)
    data = json.loads(data)
    data= data['feeds']
    data= data[len(data)-1]

    created_at= data.get('created_at')
    water_level_ = data.get('field1') 
    water_level_ = float(water_level_)
    water_level = "{:.2f}".format(water_level_)

    borewell_data = Data_1min_Borewell.objects.create(
        water_level= water_level,
        borewell= elem,
        created_at= created_at
    )

    borewell_data.save()
            
    while Data_1min_Borewell.objects.filter(borewell = elem).count() >= 2 :
        Data_1min_Borewell.objects.filter(borewell = elem).first().delete()

def get_data_tank(elem):
    start="https://api.thingspeak.com/channels/"
    middle="/feeds.json?api_key="
    url = start + str(elem.channelID) 
    url += middle + elem.readAPIKEY
    data=api_call(url,elem.channelID,elem.name)
    data = json.loads(data)
    data= data['feeds']
    data= data[len(data)-1]
    water_level = data.get('field6') 
    temp = data.get('field7')
    created_at= data.get('created_at')
    water_level_from_below_in_cm = -1
    vol = -1
    if water_level is not None and water_level != "":
        water_level_from_below = (float(elem.Depth *100) - (float(water_level))) / 100
        water_level_from_below_in_cm_ = (float(elem.Depth *100) - (float(water_level)))
        water_level_from_below_in_cm = "{:.2f}".format(water_level_from_below_in_cm_)
        vol_ = 1
        if(elem.length == 0 ) :
            #pir2h
            vol_ = pi*float((elem.radius*elem.radius))*float(water_level_from_below)
        elif(elem.length != 0) :
            #lbh
            vol_ = float(elem.length) * float(elem.Breadth) * float(water_level_from_below)
        else :
            vol_ = 0             
        # if it is none 
        # Create a new WaterData instance and save it
        vol_ = str(vol_)
        # vol = "{:.2f}".format(vol_)
        vol = vol_[0:4]

    water_data = Data_1min_Tank.objects.create(
                    water_level=checkFloat(water_level_from_below_in_cm),
                    tanker= elem,
                    temp = checkFloat(temp),
                    curr_volume= checkFloat(vol),
                    created_at=created_at)
    
    water_data.save()

    while Data_1min_Tank.objects.filter(tanker = elem).count() >= 2 :
        Data_1min_Tank.objects.filter(tanker = elem).first().delete()

#######################
def fetch_data_static_node(): #static nodes == tanker
    avail_tankers = Static_Nodes.objects.all()
    for curr_tanker in avail_tankers :
        channel_id = curr_tanker.channelID
        read_api_key = curr_tanker.readAPIKEY
            
        # Make the API call to ThingSpeak
        url = f'https://api.thingspeak.com/channels/{channel_id}/feeds.json?api_key={read_api_key}'
        response = requests.get(url)

        if response.status_code == 200:
            data = response.json()
            data= data['feeds']
            data= data[len(data)-1]
            
            water_level = data.get('field6') 
            temp = data.get('field7')
            created_at= data.get('created_at')
            if water_level is not None and water_level != "":
                water_level_from_below = (float(curr_tanker.Depth *100) - (float(water_level))) / 100
                water_level_from_below_in_cm_ = (float(curr_tanker.Depth *100) - (float(water_level)))
                water_level_from_below_in_cm = "{:.2f}".format(water_level_from_below_in_cm_)
                vol_ = 1
                if(curr_tanker.length == 0 ) :
                    #pir2h
                    vol_ = pi*float((curr_tanker.radius*curr_tanker.radius))*float(water_level_from_below)
                elif(curr_tanker.length != 0) :
                    #lbh
                    vol_ = float(curr_tanker.length) * float(curr_tanker.Breadth) * float(water_level_from_below)
                else :
                    vol_ = 0             
                # if it is none 
                # Create a new WaterData instance and save it
                vol_ = str(vol_)
                # vol = "{:.2f}".format(vol_)
                vol = vol_[0:4]
                # vol = float(vol_)
                current_Static_Node_Data.objects.filter(created_at=created_at).filter(tanker=curr_tanker).delete()
                water_data = current_Static_Node_Data.objects.create(
                    water_level=water_level_from_below_in_cm,
                    tanker=curr_tanker,
                    temp = checkFloat(temp),
                    curr_volume= checkFloat(vol),
                    created_at=created_at)
                water_data.save()

                while current_Static_Node_Data.objects.filter(tanker = curr_tanker).count() > 192 :
                    current_Static_Node_Data.objects.filter(tanker = curr_tanker).first().delete()

def fetch_borewell_data():
    avail_borewell = Borewell_Node.objects.all()
    for curr_borewell in avail_borewell :
        #curr_tanker = Tanker.objects.first()  
        channel_id = curr_borewell.channelID
        read_api_key = curr_borewell.readAPIKEY
            
        url = f'https://api.thingspeak.com/channels/{channel_id}/feeds.json?api_key={read_api_key}'
        response = requests.get(url)
        if response.status_code == 200:
            data = response.json()
            data= data['feeds']
            data= data[len(data)-1] 
            #SomeModel.objects.filter(id=id).delete()
            # Process and store the retrieved data
            
            created_at= data.get('created_at')
            water_level_ = data.get('field1') 
            water_level_ = float(water_level_)
            water_level = "{:.2f}".format(water_level_)
            current_Borewell_Node_Data.objects.filter(created_at=created_at).filter(borewell=curr_borewell).delete()
            borewell_data = current_Borewell_Node_Data.objects.create(water_level=checkFloat(water_level),                                                                       
                                                                                borewell=curr_borewell,
                                                                                created_at= created_at
                                                                                )
            borewell_data.save()
            
            while current_Borewell_Node_Data.objects.filter(borewell = curr_borewell).count() > 240 :
                    current_Borewell_Node_Data.objects.filter(borewell = curr_borewell).first().delete()

def cleanData():
    # Get the current time and subtract 1 hour
    current_time = timezone.now() - timedelta(hours=1)
    
    # Calculate the time threshold (2 days before the adjusted current time)
    time_threshold = current_time - timedelta(days=2)

    # Calculate the time threshold (5 days before the adjusted current time)
    time_threshold_ten = current_time - timedelta(days=5)

    nodes_water= Water_Node.objects.all()

    nodes_tank = Static_Nodes.objects.all()
    
    nodes_borewell= Borewell_Node.objects.all()

    for elem in nodes_water:
        water_data_1hr.objects.filter(
            node= elem,
            created_at__lt= time_threshold
        ).delete()
    
    for elem in nodes_tank:
        current_Static_Node_Data.objects.filter(
            tanker= elem,
            created_at__lt= time_threshold
        ).delete()

    for elem in nodes_borewell:
        current_Borewell_Node_Data.objects.filter(
            borewell= elem,
            created_at__lt= time_threshold_ten
        ).delete()