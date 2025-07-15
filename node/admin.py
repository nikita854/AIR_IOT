from django.contrib import admin
# from .models import IIIT_Node, Airveda_Node, Data_10min, Data_1Hour
from .models import Water_Node,Static_Nodes,Pipe_lines,Borewell_Node

way_to_display = (
    # ('Name', {'fields': ['name']}),
    # ('ChannelID', {'fields': ['channelID']}),
    # ('ReadAPIKEY', {'fields': ['readAPIKEY']}),
    # ('Location', {'fields': ['location']}),
    # ('Coordinates', {'fields': ['coordinates']}),
    # ('Visibility', {'fields': ['visibility']}),
    # ('Parameters', {'fields': ['aqi', 'tempurature', 'humidity']}),
    'name',
    'channelID',
    'readAPIKEY',
    'location',
    'coordinates',
    'visibility',
    ('aqi', 'temperature', 'humidity'),
    ('nh3', 'no2', 'co'),
    ('pm25', 'pm10'),
)


    
class Water_NodeAdmin(admin.ModelAdmin):
    list_display=('name', 'location', 'visibility')
    fields = way_to_display[:6]+('isanalog','flowrate','totalflow','pressure','pressurevoltage')
# class Data_10minAdmin(admin.ModelAdmin):
#     list_display=('nodeID','created_at')

# class Data_1HourAdmin(admin.ModelAdmin):
#     list_display=('nodeID','created_at')


# Register your models here.
""" admin.site.register(IIIT_Node, IIIT_NodeAdmin)
admin.site.register(Airveda_Node, Airveda_NodeAdmin) """
# admin.site.unregister(Quality_Indices)

class Static_NodeAdmin(admin.ModelAdmin):
    list_display=('name', 'location', 'coordinates','visibility')
    fields = way_to_display[:6]+('Depth','shape','length','Breadth','radius','waterlevel','totalvolume')

class Pipe_linesAdmin(admin.ModelAdmin):
    list_display=('name', 'coordinates', 'color','visibility')
    #fields = ('name', 'coordinates', 'color', 'visibility')
    
class Borewell_NodeAdmin(admin.ModelAdmin):
    list_display=('name', 'location','visibility','coordinates')
    fields = way_to_display[:6]+('waterlevel',)

admin.site.register(Water_Node,Water_NodeAdmin)
admin.site.register(Static_Nodes,Static_NodeAdmin)
admin.site.register(Pipe_lines,Pipe_linesAdmin)
admin.site.register(Borewell_Node,Borewell_NodeAdmin)