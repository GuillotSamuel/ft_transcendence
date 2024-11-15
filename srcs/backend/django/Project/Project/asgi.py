"""
ASGI config for Project project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/3.2/howto/deployment/asgi/
"""

# Project/asgi.py
import os
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from AppGame.routing import websocket_urlpatterns

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Project.settings')

application = ProtocolTypeRouter({
    "http": get_asgi_application(),  # Gère les requêtes HTTP classiques
    "websocket": AuthMiddlewareStack(  # Gère les connexions WebSocket
        URLRouter(websocket_urlpatterns)  # Utilise les URL définies dans AppGame/routing.py
    ),
})
