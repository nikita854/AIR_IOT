from django.db import models
from django.contrib.gis.geos import Point
from django.db.models.signals import post_save
from location_field.models.spatial import LocationField
from django_jsonform.models.fields import ArrayField
from colorfield.fields import ColorField 



# Create your models here.
VISIBILITY = [(1, 'show'), (0, 'hide')]


class Static_Nodes(models.Model):
    # Name,Location,Type,Visibility
    nodeID=models.AutoField(primary_key=True)
    name = models.CharField(max_length=100, default='-')
    location = models.CharField(max_length=50, default='-')
   
    TYPE_OF_NODE = [
        ('Tank', 'Tank'),
        ('Sump', 'Sump'),
    ]
    type = models.CharField(max_length=50, choices=TYPE_OF_NODE, default='Tank')
    visibility = models.BooleanField("Show Node on the Map", default=True)
    # 23/05/23 AT
    channelID = models.PositiveIntegerField(default=0, null = True)
    readAPIKEY = models.CharField(max_length=20,default='-', null = True)
    Depth = models.DecimalField(default=0, null = True, max_digits = 6,decimal_places=2)
    
    TYPE_SHAPE = (
        ('square', 'Rectangle'),
        ('round', 'Round'),
    )
    shape = models.CharField(max_length=6, choices=TYPE_SHAPE, default='square')


    
    length = models.DecimalField(default=None, null = True,max_digits = 6,decimal_places=2,blank =True)
    Breadth = models.DecimalField(default=None, null = True, max_digits = 6,decimal_places=2,blank =True)
    radius = models.DecimalField(default=None, null = True, max_digits = 6,decimal_places=2,blank =True)
    coordinates = LocationField(based_fields=['city'], zoom=18, default=Point(78.3481,17.44642))
    waterlevel = models.BooleanField("Show Water Level",default=True)
    # temperature = models.BooleanField("Show Temperature",default=True)
    totalvolume = models.BooleanField("Show Current Volume",default=True)
    
    def save(self, *args, **kwargs) :
        if self.shape == 'square':
            #self.radius = None
            if (self.length and self.Breadth) is None :
                raise ValueError("Length and Breadth must be provided for a Rectangle tank.")
            if self.radius is not None :
                self.radius = None
                raise ValueError("Radius cannot be provided for Rectangle")

        elif self.shape == 'round':
            # self.length = None
            # self.breadth = None
            if self.radius is None:
                raise ValueError("Radius must be provided for a round tank.")
            if (self.length or self.Breadth) is not None :
                raise ValueError("Length and breath cannot be provided for a round tank")
        
        s= super(Static_Nodes, self).save(*args, **kwargs)
        # createiiit(self)
        return s
    ####

    def __unicode__(self):
        return self.nodeID
    
    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name_plural="Tank Nodes"

class Pipe_lines(models.Model):
    # Name, Coordinates Array, Color,Visibility
    pipeID=models.AutoField(primary_key=True)
    name = models.CharField(max_length=50, default='-')
    coordinates = ArrayField(LocationField(based_fields=['city'], zoom=18, default=Point(78.3481,17.44642)))
    color = ColorField(default='#0000FF')
    visibility = models.BooleanField("Show Pipe on the Map", default=True)

    def __unicode__(self):
        return self.pipeID
    
    def __str__(self):
        return self.name

    class Meta:
        verbose_name_plural="Pipe Lines"
    


class Data_10min(models.Model):
    nodeID=models.CharField(max_length=50)
    created_at=models.DateTimeField()
    pm25=models.FloatField()
    pm10=models.FloatField()
    aqi=models.FloatField()
    temperature=models.FloatField()
    humidity=models.FloatField()
    co=models.FloatField()
    no2=models.FloatField()
    nh3=models.FloatField()

    def __unicode__(self):
        return self.nodeID

    class Meta:
        verbose_name_plural="10 minute data"

class Data_1Hour(models.Model):
    nodeID=models.CharField(max_length=50)
    created_at=models.DateTimeField()
    pm25=models.FloatField()
    pm10=models.FloatField()
    aqi=models.FloatField()
    temperature=models.FloatField()
    humidity=models.FloatField()
    co=models.FloatField()
    no2=models.FloatField()
    nh3=models.FloatField()

    def __unicode__(self):
        return self.nodeID

    class Meta:
        verbose_name_plural="Hourly Data"






class Water_Node(models.Model):
    nodeID=models.AutoField(primary_key=True)
    name = models.CharField(max_length=50, default='-')
    channelID = models.PositiveIntegerField(default=0)
    readAPIKEY = models.CharField(max_length=20,default='-')
    location = models.CharField(max_length=50, default='-')
    coordinates = LocationField(based_fields=['city'], zoom=18, default=Point(78.3481,17.44642))
    visibility = models.BooleanField("Show Node on the Map", default=True)
    
    flowrate =models.BooleanField("Show Flow Rate",default = True)
    totalflow = models.BooleanField("Show Total Flow",default=True)
    pressure = models.BooleanField("Show Pressure",default=True)
    pressurevoltage = models.BooleanField("Show Pressure Voltage",default=True)

    isanalog = models.BooleanField("Is analog",default=False)
    def __str__(self):
        return self.name

    def __unicode__(self):
        return self.name
    
    def save(self, *args, **kwargs) :
        s= super(Water_Node, self).save(*args, **kwargs)
        # createiiit(self)
        return s

    class Meta:
        verbose_name_plural="Water Nodes"
        
        
#########
class Borewell_Node(models.Model):
    nodeID=models.AutoField(primary_key=True)
    name = models.CharField(max_length=50)
    channelID = models.PositiveIntegerField()
    readAPIKEY = models.CharField(max_length=20)
    location = models.CharField(max_length=50,null=True,default='-')
    visibility = models.BooleanField("Show Node on the Map", default=True)
    coordinates = LocationField(based_fields=['city'], zoom=50, default=Point(78.3481,17.44642))
    waterlevel = models.BooleanField("Show Water Level",default=True)
    # curr_volume =  models.BooleanField("Show Water Level",default=True)
    
    def __str__(self):
        return self.name

    def __unicode__(self):
        return self.name
    
    def save(self, *args, **kwargs) :
        s= super(Borewell_Node, self).save(*args, **kwargs)
        return s

    class Meta:
        verbose_name_plural="Borewell Node"