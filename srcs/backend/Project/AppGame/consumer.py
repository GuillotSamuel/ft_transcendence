# AppGame/consumer.py
import json
from channels.generic.websocket import AsyncWebsocketConsumer

class GameConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # Acceptons toutes les connexions (à des fins de test)
        await self.accept()

    async def disconnect(self, close_code):
        # Gérer la déconnexion (facultatif)
        pass

    async def receive(self, text_data):
        # Recevoir un message envoyé par le client
        text_data_json = json.loads(text_data)
        message = text_data_json['message']

        # Renvoi du message reçu vers le client
        await self.send(text_data=json.dumps({
            'message': message
        }))
