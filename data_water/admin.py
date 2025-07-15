from django.contrib import admin
from .models import Data_10min,Data_1Hour,current_Static_Node_Data,current_Borewell_Node_Data
# Register your models here.

class Data_10minAdmin(admin.ModelAdmin):
    list_display=('node','created_at')

class Data_1hrAdmin(admin.ModelAdmin):
    list_display=('node','created_at')

class current_Static_Node_DataAdmin(admin.ModelAdmin) :
    list_display= ('tanker','created_at')

class current_BorewellNode_DataAdmin(admin.ModelAdmin):
    list_display= ('borewell','created_at')

admin.site.register(Data_10min,Data_10minAdmin)
admin.site.register(Data_1Hour,Data_1hrAdmin)
admin.site.register(current_Static_Node_Data,current_Static_Node_DataAdmin)
admin.site.register(current_Borewell_Node_Data,current_BorewellNode_DataAdmin)