from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from .remote_game.game_manager import GameManager
import json

class GameConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user = await self.get_user_from_cookie()
        self.match = await self.get_user_match()
        self.group_name = f"Match{self.match.uuid}"
        
        await self.accept()
        
        await self.channel_layer.group_add(self.group_name, self.channel_name)

        self.player_number = await self.get_player_role()

        await self.send(json.dumps({
            'event_name': 'ASSIGN_ROLE',
            'data': {
                'player_role': self.player_number,
            }
        }))

        if self.match.status == 2:
            self.game = GameManager.get_game(self.match.uuid, self.channel_layer)
            await self.game.start_game()
        else:
            message = f"Le joueur {self.user.username} is waiting..."
            await self.channel_layer.group_send(
                self.group_name,
                {
                    'type': 'send_event',
                    'event_name': 'PRINTFORUSER',
                    'data': message
                }
            )

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        direction = text_data_json.get('direction')

        self.game.update_player_direction(self.player_number, direction)

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.group_name, self.channel_name)

        # Vérifier et mettre à jour le statut du match en base de données
        await database_sync_to_async(self.handle_player_disconnect)()

        await self.channel_layer.group_send(
            self.group_name,
            {
                'type': 'send_event',
                'event_name': 'PLAYER_DISCONNECTED',
                'data': {
                    'player_number': self.player_number
                }
            }
        )


    @database_sync_to_async
    def get_user_match(self):
        if self.user.matches_player1.exists():
            return self.user.matches_player1.first()
        else:
            return self.user.matches_player2.first()
        
    @database_sync_to_async
    def get_player_role(self):
        if self.match.player1 == self.user:
            return 1
        elif self.match.player2 == self.user:
            return 2
        return None

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

    async def match_ready(self, event):
        # Mettre à jour le statut du match
        self.match = await self.get_user_match()
        if self.match.status == 2:
            self.game = GameManager.get_game(self.match.uuid, self.channel_layer)
            await self.game.start_game()


    async def handle_player_disconnect(self):
        if self.player_number == 1:
            # Si le joueur 1 se déconnecte
            self.match.player1 = None
            if self.match.player2:
                self.match.status = 1  # Le match revient en attente
            else:
                self.match.status = 0  # Plus de joueurs, le match est annulé
        elif self.player_number == 2:
            # Si le joueur 2 se déconnecte
            self.match.player2 = None
            if self.match.player1:
                self.match.status = 1  # Le match revient en attente
            else:
                self.match.status = 0  # Plus de joueurs, le match est annulé
        
        self.match.save()