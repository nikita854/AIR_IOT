from django.contrib import admin
from rangefilter.filters import DateRangeFilter, DateTimeRangeFilter
from django_admin_listfilter_dropdown.filters import DropdownFilter, RelatedDropdownFilter, ChoiceDropdownFilter
from logger.models import Airveda_Logs, IIIT_Logs, Log_Category

# Register your models here.
class Log_CategoryAdmin(admin.ModelAdmin):
    list_display=('display_name',)

class IIIT_LogAdmin(admin.ModelAdmin):
    list_display=('node', 'get_category', 'event_time', 'updated_time')
    # list_display=('node', 'event_time', 'updated_time')
    list_filter = (('event_time', DateRangeFilter), \
                    ('created_time', DateRangeFilter), \
                    ('updated_time', DateRangeFilter), \
                    ('node',  RelatedDropdownFilter), \
                    ('category',  RelatedDropdownFilter))
    
    def get_category(self, obj):
        return ", ".join([p.display_name for p in obj.category.all()])

class Airveda_LogAdmin(admin.ModelAdmin):
    list_display=('node', 'get_category', 'event_time', 'updated_time')
    # list_display=('node', 'event_time', 'updated_time')
    list_filter = (('event_time', DateRangeFilter), \
                    ('created_time', DateRangeFilter), \
                    ('updated_time', DateRangeFilter), \
                    ('node',  RelatedDropdownFilter), \
                    ('category',  RelatedDropdownFilter))

    def get_category(self, obj):
        return ", ".join([p.display_name for p in obj.category.all()])


admin.site.register(Airveda_Logs, Airveda_LogAdmin)
admin.site.register(IIIT_Logs, IIIT_LogAdmin)
admin.site.register(Log_Category, Log_CategoryAdmin)
