import requests
import json
import time
import datetime
import copy

parameters = {'aqi':'field1','pm10':'field2','pm25':'field3','co':'field4','nox':'field5'}
data_format = {      
    "field1": None,
    "field2": None,
    "field3": None,
    "field4": None,
    "field5": None,
    "field6": None,
    "field7": None,
    "field8": None,
    "created_at": None,
    "entry_id": None,
    "status": None,
    "latitude": None,
    "longitude": None,
    "elevation": None
}

def parsedata(status_code, data, deviceId):
    data=data[deviceId]
    #print(data)
    last_updated=data['lastUpdated']
    data=data['data']
    data_upload=copy.copy(data_format)
    data_upload['created_at']=last_updated
    data_upload['status']=status_code
    for x in data:
        data_upload[parameters[x['type']]]=x['value']
    for x in list(data_upload):
        if(data_upload[x]==None):
            del data_upload[x]
    return data_upload

def getAirToken():
    url = 'https://dashboard.airveda.com/api/token/'
    payload = {
        'email': 'iiit@airveda.com',
        'password': 'iiitinstitute'
    }
    return (requests.post(url, payload).json())
    
# Get latest Airveda data without token
def getAirData_tokenless(url):
    pg = requests.get(url, params=parameters)
    data = pg.json()
    return data

# Refresh Token
def refreshToken(token):
    url = 'https://dashboard.airveda.com/api/token/refresh/'
    payload = {'refreshToken': token}
    return (requests.post(url, payload).json())
    
# Get latest Airveda data with token
def getAirData(tokenID, deviceID_ip):
    url = 'https://dashboard.airveda.com/api/data/latest/'
    payload = {'deviceIds': deviceID_ip}
    headers = {'Authorization': 'Bearer ' + tokenID}
    response = (requests.post(url, data = payload, headers = headers))
    return(response.status_code,response.json()) 

def job(tokenID, deviceID, writeAPIKey, channelID):
    statusCode,data_unformatted=getAirData(tokenID,deviceID)
    data_formatted=parsedata(statusCode,data_unformatted,deviceID)
    data={'write_api_key':writeAPIKey,'updates':[data_formatted]}
    #print(json.dumps(data,indent=4))
    url = 'https://api.thingspeak.com/channels/' + channelID + '/bulk_update.json'
    r = requests.post(url, json = data)
    pass  
