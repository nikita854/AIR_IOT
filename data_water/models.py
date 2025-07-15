from django.db import models
from node.models import Water_Node,Static_Nodes,Borewell_Node
# Create your models here.

class Data_1min_Borewell(models.Model):
    borewell = models.ForeignKey(Borewell_Node, on_delete=models.CASCADE)
    created_at=models.DateTimeField()
    water_level = models.FloatField(null=True,default=0) #field 1

    def __str__(self):
        return f"Water Data for {self.borewell.name}"
    
    class Meta:
        verbose_name_plural="Borewell Data 1min"

class Data_1min_Tank(models.Model):
    tanker = models.ForeignKey(Static_Nodes, on_delete=models.CASCADE)
    created_at=models.DateTimeField()
    water_level = models.FloatField(null=True,default=0) #field 6
    temp = models.FloatField(null=True,default=0) #field 7
    curr_volume = models.FloatField(null=True,default=0)
    
    def __str__(self):
        return f"Water Data for {self.tanker.name}"
    
    class Meta:
        verbose_name_plural="Tank Node Data 1min"
            

class Data_10min(models.Model):
    node=models.ForeignKey(Water_Node, on_delete=models.CASCADE, default=1)
    # nodeID=models.CharField(max_length=50)
    created_at=models.DateTimeField()
    flowrate=models.FloatField()
    totalflow=models.FloatField()
    pressure=models.FloatField()
    pressurevoltage=models.FloatField()    

    def __unicode__(self):
        return self.nodeID

    class Meta:
        verbose_name_plural="10 minute data"

class Data_1Hour(models.Model):
    node=models.ForeignKey(Water_Node, on_delete=models.CASCADE, default=1)
    # nodeID=models.CharField(max_length=50)
    created_at=models.DateTimeField()
    flowrate=models.FloatField()
    totalflow=models.FloatField()
    pressure=models.FloatField()
    pressurevoltage=models.FloatField()    

    def __unicode__(self):
        return self.nodeID

    class Meta:
        verbose_name_plural="Hourly Data"
        
# # 23/5 at
# class Data_10min_Static_Nodes(models.Model):
#     node=models.ForeignKey(Static_Nodes, on_delete=models.CASCADE, default=1)
#     # nodeID=models.CharField(max_length=50)
#     #created_at=models.DateTimeField()
#     # created_at = models.DateTimeField(auto_now_add=True)
#     water_level=models.FloatField()
#     volume_rem=models.FloatField()
#     total_vol=models.FloatField()

#     def __unicode__(self):
#         return self.nodeID

#     class Meta:
#         verbose_name_plural="10 minute data of tank"
        
#         ####

class current_Static_Node_Data(models.Model):
    tanker = models.ForeignKey(Static_Nodes, on_delete=models.CASCADE)
    created_at=models.DateTimeField()
    water_level = models.FloatField(null=True,default=0) #field 6
    temp = models.FloatField(null=True,default=0) #field 7
    curr_volume = models.FloatField(null=True,default=0)
    
    def __str__(self):
        return f"Water Data for {self.tanker.name}"
    
    class Meta:
        verbose_name_plural="Tank Node Data"


# #########
class current_Borewell_Node_Data(models.Model):
    borewell = models.ForeignKey(Borewell_Node, on_delete=models.CASCADE)
    created_at=models.DateTimeField()
    water_level = models.FloatField(null=True,default=0) #field 1

    def __str__(self):
        return f"Water Data for {self.borewell.name}"
    
    class Meta:
        verbose_name_plural="Borewell Data"
