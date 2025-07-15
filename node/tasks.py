import time
import json
from requests import get
from huey import crontab
from huey.contrib.djhuey import task, periodic_task, db_task
from requests.models import guess_json_utf

from .models import  Water_Node,Borewell_Node,Static_Nodes
from data_water.models import Data_10min as water_data_10min
from node.utils import *


@db_task()
def begin_water_data():
   
    nodes=Water_Node.objects.all()
    #print(nodes)
    for elem in nodes:
        data=get_data_sp(elem,10)
        d = get_object_water_10min(elem,data)
        water_data_10min.objects.filter(created_at = d.created_at).filter(node=d.node).delete()
        d.save()

        while(water_data_10min.objects.filter(node=elem).count() >= 2):
            water_data_10min.objects.filter(node=elem).first().delete() 

@db_task()
def get1HourDataAtBegining():
    
    nodes=Water_Node.objects.all()
    #print(nodes)
    for elem in nodes:
        data=get_data_sp(elem,60)
        d = get_object_water_1hour(elem,data)
        water_data_1hr.objects.filter(created_at = d.created_at).filter(node=d.node).delete()
        d.save()

        while(water_data_1hr.objects.filter(node=elem).count() > 96):
            water_data_1hr.objects.filter(node=elem).first().delete() 

@db_task()
def begin_tank_data():
    # current_Static_Node_Data.objects.all().delete()
    if Static_Nodes.objects.first() is not None :
        fetch_data_static_node()

    nodes= Static_Nodes.objects.all()

    for elem in nodes:
        get_data_tank(elem)    

@db_task()
def begin_borewell_data():
    # current_Borewell_Node_Data.objects.all().delete()
    if Borewell_Node.objects.first() is not None :
        fetch_borewell_data()
    nodes= Borewell_Node.objects.all()

    for elem in nodes:
        get_data_borewell(elem)

# periodic tasks

@periodic_task(crontab(minute='*/2'))
def getLatestWaterData():
    
    nodes=Water_Node.objects.all()
    #print(nodes)
    for elem in nodes:
        data=get_data_sp(elem,10)
        d = get_object_water_10min(elem,data)
        water_data_10min.objects.filter(created_at = d.created_at).filter(node=d.node).delete()
        d.save()

        while(water_data_10min.objects.filter(node=elem).count() >= 2):
            water_data_10min.objects.filter(node=elem).first().delete()

@periodic_task(crontab(minute='*/2'))
def getLatestTankData():
    nodes_tank= Static_Nodes.objects.all()
    for elem in nodes_tank:
        get_data_tank(elem)   

@periodic_task(crontab(minute='*/2'))
def getLatestBorewellData():
    nodes_borewell= Borewell_Node.objects.all()
    for elem in nodes_borewell:
        get_data_borewell(elem)

@periodic_task(crontab(minute='*/5'))
def cleaner():
    cleanData()

@periodic_task(crontab(minute='*/15'))
def get1HourData():
    
    nodes=Water_Node.objects.all()
    #print(nodes)
    for elem in nodes:
        data=get_data_sp(elem,60)
        d = get_object_water_1hour(elem,data)
        water_data_1hr.objects.filter(created_at = d.created_at).filter(node=d.node).delete()
        d.save()

        while(water_data_1hr.objects.filter(node=elem).count() > 192):
            water_data_1hr.objects.filter(node=elem).first().delete() 

@periodic_task(crontab(minute='*/15'))
def tank_data():
    if Static_Nodes.objects.first() is not None :
        fetch_data_static_node()
    

@periodic_task(crontab(minute='*/30'))
def borewell_data():
    if Borewell_Node.objects.first() is not None :
        fetch_borewell_data()