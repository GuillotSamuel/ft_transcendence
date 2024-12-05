from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
import json

class GameConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        from .remote_game.game_manager import GameManager
        self.game = None
        self.user = await self.get_user_from_cookie()
        self.match = await self.get_match()

        if not self.match:
            print("Aucun match trouvé, fermeture de la connexion WebSocket.")
            await self.close()
            return

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
        direction = text_data_json.get('direction', None)

        if direction is not None:
            #print(f"Direction reçue pour le joueur {self.player_number}: {direction}")
            self.game.update_player_direction(self.player_number, direction)

    async def disconnect(self, close_code):
        if self.game and self.game.game_active == True:
            print("Vous avez quitte la game en plein match!")
            await self.game.set_winner_from_disconnect(self.player_number)
        print(f"Déconnexion du joueur {self.player_number} dans le match {self.match.uuid}.")
    
    @database_sync_to_async
    def get_match(self):
        print(f"Recherche de match pour l'utilisateur {self.user.id}")

        # Chercher un match en attente (status=1)
        match = self.user.matches_player1.filter(status=1).first() or self.user.matches_player2.filter(status=1).first()
        if match:
            print(f"Match trouvé avec status=1: {match.uuid}")
            return match

        # Chercher un match en cours (status=2)
        match = self.user.matches_player1.filter(status=2).first() or self.user.matches_player2.filter(status=2).first()
        if match:
            print(f"Match trouvé avec status=2: {match.uuid}")
            return match

        # Chercher un match terminé (status=0)
        match = self.user.matches_player1.filter(status=0).first() or self.user.matches_player2.filter(status=0).first()
        if match:
            print(f"Match trouvé avec status=0: {match.uuid}")
            return match

        print("Aucun match trouvé pour l'utilisateur.")
        return None


        
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
        from .remote_game.game_manager import GameManager
        self.match = await self.get_match()

        if not self.match:
            print("Aucun match trouvé dans match_ready.")
            return

        if self.match.status == 2:
            self.game = GameManager.get_game(self.match.uuid, self.channel_layer)
            await self.game.start_game()


    def handle_player_disconnect(self):
        if self.player_number == 1:
            self.match.player1 = None
        elif self.player_number == 2:
            self.match.player2 = None

        if self.match.player1 is None and self.match.player2 is None:
            # Si les deux joueurs sont déconnectés, supprimer le match
            self.match.delete()
        else:
            # Sinon, mettre à jour le statut
            self.match.status = 1 if self.match.player1 or self.match.player2 else 0
            self.match.save()
