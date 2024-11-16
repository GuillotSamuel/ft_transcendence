# AppGame/routing.py
from django.urls import path
from .consumer import GameConsumer

websocket_urlpatterns = [
    path('ws/game/', GameConsumer.as_asgi()),  # Associe l'URL /ws/game/ au GameConsumer
]
