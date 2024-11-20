import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
import math
import random
import asyncio

class GameState:
    def __init__(self, match_uuid, channel_layer):
        self.match_uuid = match_uuid
        self.channel_layer = channel_layer
        self.canvas_width = 800
        self.canvas_height = 600
        self.paddle_height = 100
        self.paddle_width = 10
        self.ball_radius = 10
        self.paddle1_y = (self.canvas_height - self.paddle_height) / 2
        self.paddle2_y = (self.canvas_height - self.paddle_height) / 2
        self.paddle_speed = 380
        self.player1_direction = 0 # -1: up, 0: IDLE, 1: down
        self.player2_direction = 0
        self.ball_x = self.canvas_width / 2
        self.ball_y = self.canvas_height / 2
        self.default_ball_velocity = 475
        self.ball_velocity = self.default_ball_velocity
        self.ball_velocity_increase = 20
        self.ball_vx = 0
        self.ball_vy = 0
        self.player1_score = 0
        self.player2_score = 0
        self.max_angle_deviation = 45 * math.pi / 180
        self.initial_angle_deviation = 22.5 * math.pi / 180
        self.ball_active = True

    async def start_game(self):
        self.reset_ball(direction=random.choice([-1, 1]))
        await self.channel_layer.group_send(
            f"Match{self.match_uuid}",
            {
                "type": "send_event",
                "event_name": "GAME_START",
                "data": {
                    'uuid': str(self.match_uuid),
                    'p1_score': self.player1_score,
                    'p2_score': self.player2_score,
                    'b_x': self.ball_x,
                    'b_y': self.ball_y,
                    "p1_pos": self.paddle1_y,
                    "p2_pos": self.paddle2_y,
                }
            }
        )
        asyncio.create_task(self.game_loop())

    async def activate_ball(self):
        await asyncio.sleep(2)
        self.ball_active = True

    async def game_loop(self):
        last_time = asyncio.get_event_loop().time()
        while True:
            current_time = asyncio.get_event_loop().time()
            delta_time = current_time - last_time
            last_time = current_time
            if self.update_game_state(delta_time):
                await self.channel_layer.group_send(
                    f"Match{self.match_uuid}",
                    {
                        "type": "send_event",
                        "event_name": "GAME_SCORE_UPDATE",
                        "data": {
                            'uuid': str(self.match_uuid),
                            'p1_score': self.player1_score,
                            'p2_score': self.player2_score
                        }
                    }
                )
                self.ball_active = False
                asyncio.create_task(self.activate_ball())

            state_update = {
                'uuid': str(self.match_uuid),
                "p1_pos": self.paddle1_y,
                "p2_pos": self.paddle2_y,
                "b_x": self.ball_x,
                "b_y": self.ball_y,
                'p1_score': self.player1_score,
                'p2_score': self.player2_score
            }

            await self.channel_layer.group_send(
                f"Match{self.match_uuid}",
                {
                    "type": "send_event",
                    "event_name": "GAME_STATE_UPDATE",
                    "data": state_update
                }
            )
            await asyncio.sleep(1 / 60)

    def update_game_state(self, delta_time):
        if (self.player1_direction != 0):
            self.paddle1_y += self.player1_direction * self.paddle_speed * delta_time
        if (self.player2_direction != 0):
            self.paddle2_y += self.player2_direction * self.paddle_speed * delta_time

        collision_buffer = 1
        self.paddle1_y = max(collision_buffer, min(self.canvas_height - self.paddle_height - collision_buffer, self.paddle1_y))
        self.paddle2_y = max(collision_buffer, min(self.canvas_height - self.paddle_height - collision_buffer, self.paddle2_y))

        if self.ball_active:
            next_ball_x = self.ball_x + self.ball_vx * delta_time
            next_ball_y = self.ball_y + self.ball_vy * delta_time
            self.check_paddle_collision(next_ball_x, next_ball_y)
            self.check_wall_collision(next_ball_y)
            self.ball_x += self.ball_vx * delta_time
            self.ball_y += self.ball_vy * delta_time
        return self.check_scoring()

    def check_wall_collision(self, next_ball_y):
        if next_ball_y - self.ball_radius <= 0:
            self.ball_vy *= -1
            self.ball_y = self.ball_radius
        if next_ball_y + self.ball_radius >= self.canvas_height:
            self.ball_vy *= -1
            self.ball_y = self.canvas_height - self.ball_radius

    def check_paddle_collision(self, next_ball_x, next_ball_y):
        ball_radius = self.ball_radius
        paddle1 = {
            'x': 0,
            'y': self.paddle1_y,
            'width': self.paddle_width,
            'height': self.paddle_height
        }
        paddle2 = {
            'x': self.canvas_width - self.paddle_width,
            'y': self.paddle2_y,
            'width': self.paddle_width,
            'height': self.paddle_height
        }

        if (
            next_ball_x - ball_radius <= paddle1['x'] + paddle1['width'] and
            next_ball_x + ball_radius >= paddle1['x'] and
            next_ball_y + ball_radius >= paddle1['y'] and
            next_ball_y - ball_radius <= paddle1['y'] + paddle1['height']
            ):
            self.ball_x = paddle1['x'] + paddle1['width'] + ball_radius

            relative_intersect_y = (paddle1['y'] + paddle1['height'] / 2) - next_ball_y
            normalized_relative_angle = (relative_intersect_y / (paddle1['height'] / 2))
            bounce_angle = normalized_relative_angle * self.max_angle_deviation

            speed = self.ball_velocity
            self.ball_vx = speed * math.cos(bounce_angle)
            self.ball_vy = speed * -math.sin(bounce_angle)
            self.ball_velocity += self.ball_velocity_increase

        elif (
            next_ball_x + ball_radius >= paddle2['x'] and
            next_ball_x - ball_radius <= paddle2['x'] + paddle2['width'] and
            next_ball_y + ball_radius >= paddle2['y'] and
            next_ball_y - ball_radius <= paddle2['y'] + paddle2['height']
            ):
            self.ball_x = paddle2['x'] - ball_radius

            relative_intersect_y = (paddle2['y'] + paddle2['height'] / 2) - next_ball_y
            normalized_relative_angle = (relative_intersect_y / (paddle2['height'] / 2))
            bounce_angle = normalized_relative_angle * self.max_angle_deviation

            speed = self.ball_velocity
            self.ball_vx = -speed * math.cos(bounce_angle)
            self.ball_vy = speed * -math.sin(bounce_angle)
            self.ball_velocity += self.ball_velocity_increase

    def check_scoring(self):
        if self.ball_x < 0:
            self.player2_score += 1
            return self.reset_ball(direction=1)
        elif self.ball_x > self.canvas_width:
            self.player1_score += 1
            return self.reset_ball(direction=-1)
        return False

    def reset_ball(self, direction=1):
        self.ball_x = self.canvas_width / 2
        self.ball_y = self.canvas_height / 2

        self.ball_velocity = self.default_ball_velocity
        speed = self.ball_velocity
        angle = random.uniform(-self.initial_angle_deviation, self.initial_angle_deviation)

        self.ball_vx = direction * speed * math.cos(angle)
        self.ball_vy = speed * math.sin(angle)
        return True

    def update_player_direction(self, direction):
        self.player1_direction = direction
        self.player2_direction = direction

class GameConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user = await self.get_user_from_cookie()
        self.match = await self.get_user_match()
        
        self.group_name = f"Match{self.match.uuid}"
        await self.channel_layer.group_add(self.group_name, self.channel_name)
        self.game = GameState(self.match.uuid, self.channel_layer)

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
        self.game.update_player_direction(direction)


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