import json
from channels.generic.websocket import AsyncWebsocketConsumer
import logging

logger = logging.getLogger(__name__)

# Stockage en mémoire pour suivre le nombre d'utilisateurs par groupe
group_sizes = {}

class GameConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()
        logger.info("WebSocket connecté.")

    async def disconnect(self, close_code):
        if hasattr(self, 'room_group_name'):
            await self.decrement_group_size(self.room_group_name)
            await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive(self, text_data):
        # Décoder les données reçues
        data = json.loads(text_data)
        room_name = data.get('room_name')
        message = data.get('message', '')

        if room_name:
            await self.join_room(room_name)
        elif message:
            await self.broadcast_message(message)

    async def join_room(self, room_name):
        # Quitter la salle précédente si existante
        if hasattr(self, 'room_group_name'):
            await self.channel_layer.group_discard(self.room_group_name, self.channel_name)
            await self.decrement_group_size(self.room_group_name)

        # Rejoindre la nouvelle salle
        self.room_name = room_name
        self.room_group_name = f"game_{room_name}"

        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.increment_group_size(self.room_group_name)

        # Obtenir la taille actuelle du groupe
        current_players = await self.get_group_size(self.room_group_name)

        # Informer les joueurs de la salle
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'player_joined',
                'message': "Waiting for opponent..."
            }
        )

        # Démarrer la partie si deux joueurs sont connectés
        if current_players == 2:
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'game_started',
                    'message': "Partie lancée avec deux joueurs !"
                }
            )

    async def broadcast_message(self, message):
        # Diffuser un message à la salle actuelle
        if hasattr(self, 'room_group_name'):
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'game_message',
                    'message': message
                }
            )

    # Gestion des événements pour les messages
    async def game_message(self, event):
        await self.send(text_data=json.dumps({
            'type': 'message',
            'message': event['message']
        }))

    async def game_started(self, event):
        await self.send(text_data=json.dumps({
            'type': 'game_started',
            'message': event['message']
        }))

    async def player_joined(self, event):
        await self.send(text_data=json.dumps({
            'type': 'joined',
            'message': event['message']
        }))

    # Gestion du compteur d'utilisateurs par groupe
    async def increment_group_size(self, group_name):
        global group_sizes
        group_sizes[group_name] = group_sizes.get(group_name, 0) + 1

    async def decrement_group_size(self, group_name):
        global group_sizes
        if group_name in group_sizes:
            group_sizes[group_name] -= 1
            if group_sizes[group_name] <= 0:
                del group_sizes[group_name]

    async def get_group_size(self, group_name):
        return group_sizes.get(group_name, 0)
