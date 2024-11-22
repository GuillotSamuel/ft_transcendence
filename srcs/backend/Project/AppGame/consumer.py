import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from .remote_game.game_state import Game
import math
import random
import asyncio

class GameConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user = await self.get_user_from_cookie()
        self.match = await self.get_user_match()
        self.player_number = 1
        self.group_name = f"Match{self.match.uuid}"
        await self.channel_layer.group_add(self.group_name, self.channel_name)
        self.game = Game(self.match.uuid, self.channel_layer)

        if self.match.status == 2:
            message = f"Le match {self.match.uuid} a commence!"
            await self.game.start_game()
        else:
            message = f"Le match {self.match.uuid} est en attente d'un autre joueur"

        await self.channel_layer.group_send(
            self.group_name,
            {
                'type': 'send_event',
                'event_name': 'PRINTFORUSER',
                'data': message
            }
        )
        await self.accept()

    async def disconnect(self, close_code):
        pass

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        direction = text_data_json.get('direction')
        self.game.update_player_direction(self.player_number, direction)


    @database_sync_to_async
    def get_user_match(self):
        if self.user.matches_player1.first() != None:
            return self.user.matches_player1.first()
        else:
            return self.user.matches_player2.first()

    async def get_user_from_cookie(self):
        from rest_framework_simplejwt.authentication import JWTAuthentication
        from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
        from django.contrib.auth import get_user_model

        User = get_user_model()
        access_token = self.scope.get("cookies", {}).get('access_token')
        if not access_token:
            return None

        jwt_auth = JWTAuthentication()
        try:
            validated_token = await database_sync_to_async(jwt_auth.get_validated_token)(access_token)
            user = await database_sync_to_async(jwt_auth.get_user)(validated_token)
            return user
        except (InvalidToken, TokenError):
            return None
        
    async def send_event(self, event):
        event_name = event.get("event_name")
        data = event.get("data")
        await self.send(text_data=json.dumps({
            'event_name': event_name,
            'data': data
        }))