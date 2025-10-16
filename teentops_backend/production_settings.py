import os
from .settings import *
import dj_database_url

# Production settings for TeenTops e-commerce

# Security settings
DEBUG = False
ALLOWED_HOSTS = ['*']  # Configure with your domain

# Inherit SECRET_KEY from Render environment variables
SECRET_KEY = os.environ.get('SECRET_KEY', SECRET_KEY)

# Update ALLOWED_HOSTS for Render deployment
# Render automatically adds its internal domain to ALLOWED_HOSTS
RENDER_EXTERNAL_HOSTNAME = os.environ.get('RENDER_EXTERNAL_HOSTNAME')
if RENDER_EXTERNAL_HOSTNAME:
    ALLOWED_HOSTS = [RENDER_EXTERNAL_HOSTNAME]
else:
    ALLOWED_HOSTS = [] # Or a default for local production-like environments

# Configure database for PostgreSQL on Render
DATABASES = {
    'default': dj_database_url.config(
        default=os.environ.get('DATABASE_URL', 'sqlite:///db.sqlite3'),
        conn_max_age=600
    )
}

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.2/howto/static-files/

# Add WhiteNoise to serve static files efficiently
INSTALLED_APPS.append('whitenoise.runserver_nostatic')
MIDDLEWARE.insert(1, 'whitenoise.middleware.WhiteNoiseMiddleware')

STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

# Media files (user-uploaded content)
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

# CORS settings for production
# Replace with your actual frontend URL when deployed
CORS_ALLOWED_ORIGINS = [
    "https://your-frontend-url.vercel.app", # Replace with your deployed frontend URL
    # Add other production frontend URLs as needed
]

# CSRF settings for production
CSRF_TRUSTED_ORIGINS = [
    "https://your-frontend-url.vercel.app", # Replace with your deployed frontend URL
    # Add other production frontend URLs as needed
]

# Email configuration (optional)
# EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
# EMAIL_HOST = 'smtp.gmail.com'
# EMAIL_PORT = 587
# EMAIL_USE_TLS = True
# EMAIL_HOST_USER = os.environ.get('EMAIL_HOST_USER')
# EMAIL_HOST_PASSWORD = os.environ.get('EMAIL_HOST_PASSWORD')

# Logging configuration
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'file': {
            'level': 'INFO',
            'class': 'logging.FileHandler',
            'filename': os.path.join(BASE_DIR, 'django.log'),
        },
    },
    'loggers': {
        'django': {
            'handlers': ['file'],
            'level': 'INFO',
            'propagate': True,
        },
    },
}
