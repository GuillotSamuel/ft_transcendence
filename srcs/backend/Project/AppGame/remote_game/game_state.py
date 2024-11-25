
import random
import asyncio
from .paddle import Paddle
from .ball import Ball

class Game:
    def __init__(self, match_uuid, channel_layer):
        self.game_started = False
        self.match_uuid = match_uuid
        self.channel_layer = channel_layer
        self.canvas_width = 600
        self.canvas_height = 400

        self.leftPaddle = Paddle(self.canvas_height, self.canvas_width, 10)
        self.rightPaddle = Paddle(self.canvas_height, self.canvas_width, self.canvas_width - 20)

        self.player1_direction = 0  # -1: haut, 0: immobile, 1: bas
        self.player2_direction = 0

        self.ball = Ball(self.canvas_height, self.canvas_width)

        self.player1_score = 0
        self.player2_score = 0

        self.ball_active = False

    async def start_game(self):
        self.ball.resetPosition(player=random.choice([1, 2]))
        await self.channel_layer.group_send(
            f"Match{self.match_uuid}",
            {
                "type": "send_event",
                "event_name": "GAME_START",
                "data": {
                    'uuid': str(self.match_uuid),
                    'p1_score': self.player1_score,
                    'p2_score': self.player2_score,
                    'b_x': self.ball.x,
                    'b_y': self.ball.y,
                    "p1_pos": self.leftPaddle.y,
                    "p2_pos": self.rightPaddle.y,
                }
            }
        )
        asyncio.create_task(self.activate_ball())
        asyncio.create_task(self.game_loop())

    async def activate_ball(self):
        await asyncio.sleep(1)  # Délai avant la réactivation de la balle
        self.ball_active = True

    async def game_loop(self):
        last_time = asyncio.get_event_loop().time()
        while True:
            current_time = asyncio.get_event_loop().time()
            delta_time = current_time - last_time
            last_time = current_time

            if self.update_game_state(delta_time):
                self.ball_active = False
                # Déterminer quel joueur a marqué pour réinitialiser la balle
                scoring_player = 2 if self.ball.x < 0 else 1
                self.ball.resetPosition(player=scoring_player)
                asyncio.create_task(self.activate_ball())

            state_update = {
                'uuid': str(self.match_uuid),
                "p1_pos": self.leftPaddle.y,
                "p2_pos": self.rightPaddle.y,
                "b_x": self.ball.x,
                "b_y": self.ball.y,
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

       
        self.leftPaddle.move(self.player1_direction, delta_time)
        self.rightPaddle.move(self.player2_direction, delta_time)

        # Mettre à jour la balle si elle est active
        if self.ball_active:
            self.ball.update(self.leftPaddle, self.rightPaddle, delta_time)

        # Vérifier le score
        return self.check_scoring()

    def check_scoring(self):
        if self.ball.x < 0:
            self.player2_score += 1
            return True
        elif self.ball.x > self.canvas_width:
            self.player1_score += 1
            return True
        return False

    def update_player_direction(self, player, direction):
        if player == 1:
            self.player1_direction = direction
            print("p1 move")
        elif player == 2:
            self.player2_direction = direction
            print("p2 move")

