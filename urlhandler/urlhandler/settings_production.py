import os
SECRET_KEY = os.environ.get('SECRET_KEY')
DEBUG = False

TEMPLATE_DEBUG = False

ALLOWED_HOSTS = ['*']

DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.mysql',
            'NAME': os.environ.get('DB_NAME'),
            'HOST': os.environ.get('DB_HOST'),
            'PORT': os.environ.get('DB_PORT'),
            'USER': os.environ.get('DB_USER'),
            'PASSWORD': os.environ.get('DB_PASSWORD'),
            }
}
#EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
#EMAIL_HOST = 'smtp.mxhichina.com'
#EMAIL_HOST_USER = os.environ.get('EMAIL_USER')
#EMAIL_HOST_PASSWORD = os.environ.get('EMAIL_PASSWORD')
#EMAIL_PORT = 465
#EMAIL_USE_TLS = True
#SERVER_EMAIL = os.environ.get('EMAIL_USER')
ADMINS = (('Guang Chen', 'cgcgbcbc@163.com'),)

LOGGING = {
        'version': 1,
        'disable_existing_loggers': False,
        'handlers': {
            'console': {
                'level': 'INFO',
                'class': 'logging.StreamHandler',
                },
            },
        'loggers': {
            'django': {
                'handlers': ['console'],
                'propagate': True,
                },
            },
}

BASE_DIR = os.path.dirname(os.path.dirname(__file__))

STATIC_ROOT = os.path.join(BASE_DIR, 'static').replace('\\', '/')

SITE_DOMAIN = os.environ.get('SITE_DOMAIN')
