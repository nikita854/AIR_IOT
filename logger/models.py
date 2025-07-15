from django.db import models
from node.models import IIIT_Node, Airveda_Node 

# Create your models here.
class Log_Category(models.Model):
    id = models.AutoField(primary_key=True)
    display_name = models.CharField(max_length=50, default='-')
    description = models.TextField(default='-')

    def __str__(self):
        return self.display_name

    def __unicode__(self):
        return self.display_name
    
    def save(self, *args, **kwargs) :
        s= super(Log_Category, self).save(*args, **kwargs)
        return s
    
    class Meta:
        verbose_name = 'Log Category'
        verbose_name_plural = 'Log Categories'

class IIIT_Logs(models.Model):
    node=models.ForeignKey(IIIT_Node, on_delete=models.CASCADE, default=1, verbose_name='Node')
    created_time=models.DateTimeField(verbose_name='Created Time', auto_now_add=True)
    updated_time=models.DateTimeField(verbose_name='Updated Time', auto_now=True)
    event_time=models.DateTimeField(verbose_name='Event Time')
    category=models.ManyToManyField(Log_Category, verbose_name='Category')
    # category=models.ForeignKey(Log_Category, on_delete=models.CASCADE, verbose_name='Category')
    description=models.TextField(default='-')

    class Meta:
        verbose_name_plural="IIIT Logs"

class Airveda_Logs(models.Model):
    node=models.ForeignKey(Airveda_Node, on_delete=models.CASCADE, default=1, verbose_name='Node')
    created_time=models.DateTimeField(verbose_name='Created Time', auto_now_add=True)
    updated_time=models.DateTimeField(verbose_name='Updated Time', auto_now=True)
    event_time=models.DateTimeField(verbose_name='Event Time')
    category=models.ManyToManyField(Log_Category, verbose_name='Category')
    description=models.TextField(default='-')

    class Meta:
        verbose_name_plural="Airveda Logs"
