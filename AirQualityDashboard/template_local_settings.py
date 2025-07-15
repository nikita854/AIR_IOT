from AirQualityDashboard.settings import ALLOWED_HOSTS
from pathlib import Path
import os


# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


#############################################################
###   create a local_settings.py in the current directory ###
###   and use this template. Use this file to change any  ###
###   settings related to the local system                ###
#############################################################

DATABASES = {
    'default': {
        # 'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'ENGINE': 'django.contrib.gis.db.backends.postgis',
        'NAME': 'airqualitylocal',
        'USER': 'harsha1',
        'PASSWORD': 'harsha',
        'HOST':'localhost',
        'POST':'5432'
    }
}


DEBUG = True
ALLOWED_HOSTS = ['127.0.0.1', 'localhost', '0.0.0.0']
STATIC_URL = '/water/static/'
STATICFILES_DIRS = [
    os.path.join(BASE_DIR, 'static')
]