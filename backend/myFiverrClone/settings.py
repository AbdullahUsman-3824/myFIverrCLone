from pathlib import Path
from decouple import config, Csv
from datetime import timedelta

# ======================
# BASE DIRECTORY
# ======================
BASE_DIR = Path(__file__).resolve().parent.parent

# ======================
# SECURITY SETTINGS
# ======================
SECRET_KEY = config('SECRET_KEY')
DEBUG = True

ALLOWED_HOSTS = config('ALLOWED_HOSTS', default='localhost,127.0.0.1', cast=Csv())

# Session settings
SESSION_COOKIE_AGE = 3600  # 1 hour
SESSION_EXPIRE_AT_BROWSER_CLOSE = True
SESSION_SAVE_EVERY_REQUEST = True
SESSION_COOKIE_SAMESITE = 'Lax'

# CSRF settings
CSRF_TRUSTED_ORIGINS = [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://localhost:5173',
    'http://127.0.0.1:5173',
]
CSRF_COOKIE_SAMESITE = 'Lax'
CSRF_COOKIE_HTTPONLY = False

# Password settings
PASSWORD_HASHERS = [
    'django.contrib.auth.hashers.PBKDF2PasswordHasher',
    'django.contrib.auth.hashers.PBKDF2SHA1PasswordHasher',
]

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
        'OPTIONS': {'max_similarity': 0.7}
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
        'OPTIONS': {'min_length': 10}
    },
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

# ======================
# CORS SETTINGS
# ======================
CORS_ALLOWED_ORIGINS = [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://localhost:5173',
    'http://127.0.0.1:5173',
]
CORS_ALLOW_CREDENTIALS = True
CORS_EXPOSE_HEADERS = ['Content-Type', 'X-CSRFToken']

# ======================
# REST FRAMEWORK SETTINGS
# ======================
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
        'rest_framework.authentication.SessionAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticatedOrReadOnly',
    ],
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 20,
    'DEFAULT_SCHEMA_CLASS': 'drf_spectacular.openapi.AutoSchema',
    'DEFAULT_RENDERER_CLASSES': (
        'rest_framework.renderers.JSONRenderer',
        'rest_framework.renderers.BrowsableAPIRenderer',
    ),
}

# JWT settings
SIMPLE_JWT = {
    'AUTH_HEADER_TYPES': ('Bearer',),
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=60),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=1),
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': True,
    'UPDATE_LAST_LOGIN': True,
}

# ======================
# APPLICATION DEFINITION
# ======================
DJANGO_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django.contrib.sites',
]

THIRD_PARTY_APPS = [
    'rest_framework',
    'rest_framework.authtoken',
    'dj_rest_auth',
    'dj_rest_auth.registration',
    'allauth',
    'allauth.account',
    'allauth.socialaccount',
    'corsheaders',
    'drf_spectacular',
]

LOCAL_APPS = [
    'accounts.apps.AccountsConfig',
    'core.apps.CoreConfig',
    'gigs.apps.GigsConfig',
    'orders.apps.OrdersConfig',
    'payments.apps.PaymentsConfig',
    'chat.apps.ChatConfig',
    'reviews.apps.ReviewsConfig'
]

INSTALLED_APPS = DJANGO_APPS + THIRD_PARTY_APPS + LOCAL_APPS

# ======================
# MIDDLEWARE
# ======================
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'allauth.account.middleware.AccountMiddleware'
]

# ======================
# URL & TEMPLATE CONFIG
# ======================
ROOT_URLCONF = 'myFiverrClone.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / 'templates'],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'myFiverrClone.wsgi.application'

# ======================
# DATABASE CONFIG
# ======================
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': config('DB_NAME'),
        'USER': config('DB_USER'),
        'PASSWORD': config('DB_PASSWORD'),
        'HOST': config('DB_HOST'),
        'PORT': config('DB_PORT'),
        'OPTIONS': {
            'init_command': "SET sql_mode='STRICT_TRANS_TABLES'",
            'charset': 'utf8mb4',
            'connect_timeout': 30,
        }
    }
}

# ======================
# AUTHENTICATION
# ======================
AUTH_USER_MODEL = 'accounts.User'

AUTHENTICATION_BACKENDS = [
    'django.contrib.auth.backends.ModelBackend',
    'allauth.account.auth_backends.AuthenticationBackend',
]
ACCOUNT_ADAPTER = 'accounts.adapters.CustomAccountAdapter'

# ======================
# INTERNATIONALIZATION
# ======================
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_L10N = True
USE_TZ = True

# ======================
# STATIC & MEDIA FILES
# ======================
STATIC_URL = '/static/'
STATICFILES_DIRS = [BASE_DIR / 'static']
STATIC_ROOT = BASE_DIR / 'staticfiles'

MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'

# ======================
# SITE & CUSTOM SETTINGS
# ======================
SITE_ID = 1
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# ======================
# ALLAUTH SETTINGS
# ======================
ACCOUNT_AUTHENTICATION_METHOD = 'email'
ACCOUNT_EMAIL_REQUIRED = True
ACCOUNT_UNIQUE_EMAIL = True
ACCOUNT_USERNAME_REQUIRED = False
ACCOUNT_EMAIL_VERIFICATION = 'mandatory'
ACCOUNT_CONFIRM_EMAIL_ON_GET = True
ACCOUNT_EMAIL_SUBJECT_PREFIX = 'MyFiverrClone - '

# ======================
# REST AUTH SETTINGS
# ======================
REST_AUTH = {
    'USE_JWT': True,
    'JWT_AUTH_COOKIE': 'jwt',
    'JWT_AUTH_REFRESH_COOKIE': 'jwt-refresh',
    'JWT_AUTH_HTTPONLY': True,
    'JWT_AUTH_SECURE': False,
    'JWT_AUTH_SAMESITE': 'Lax',
    'SESSION_LOGIN': False,
    'LOGIN_SERIALIZER':'accounts.serializers.auth_serializers.FlexibleLoginSerializer',
    'REGISTER_SERIALIZER': 'accounts.serializers.auth_serializers.BasicRegisterSerializer',
    'USER_DETAILS_SERIALIZER': 'accounts.serializers.auth_serializers.CustomUserDetailsSerializer',
}

# ======================
# EMAIL CONFIGURATION
# ======================
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'
DEFAULT_FROM_EMAIL = 'noreply@example.com'