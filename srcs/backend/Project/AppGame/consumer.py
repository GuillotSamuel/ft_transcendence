import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async

class GameConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user = await self.get_user_from_cookie(self.scope)
        if self.user is None:
            await self.close()
            return

        match = await self.get_user_match(self.user)
        if match is None:
            await self.close()
            return
        
        self.group_name = f"Match{match.uuid}"
        await self.channel_layer.group_add(self.group_name, self.channel_name)

        if match.status == 2:
            message = f"Le match {match.uuid} a commencé!"
        else:
            message = f"Le match {match.uuid} est en attente d'un autre joueur"

        await self.channel_layer.group_send(
            self.group_name,
            {
                'type': 'match_started', 
                'message': message
            }
        )
        await self.accept()

    async def disconnect(self, close_code):
        pass

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json.get('message')

    @database_sync_to_async
    def get_user_match(self, user):
        if user.matches_player1.first() != None:
            return user.matches_player1.first()
        else:
            return user.matches_player2.first()

    async def get_user_from_cookie(self, scope):
        from rest_framework_simplejwt.authentication import JWTAuthentication
        from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
        from django.contrib.auth import get_user_model

        User = get_user_model()
        access_token = scope.get("cookies", {}).get('access_token')
        if not access_token:
            return None

        jwt_auth = JWTAuthentication()
        try:
            validated_token = await database_sync_to_async(jwt_auth.get_validated_token)(access_token)
            user = await database_sync_to_async(jwt_auth.get_user)(validated_token)
            return user
        except (InvalidToken, TokenError):
            return None

    async def match_started(self, event):
        await self.send(text_data=json.dumps({
            'message': event['message']
        }))
