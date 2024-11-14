from django.db import models
from AppAuthentification.models import GameUser
import uuid

class Match(models.Model):
    uuid = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    player1 = models.ForeignKey(GameUser, on_delete=models.CASCADE, related_name='matches_player1')
    player2 = models.ForeignKey(GameUser, on_delete=models.CASCADE, related_name='matches_player2')
    player1_score = models.IntegerField(default=0)
    player2_score = models.IntegerField(default=0)
    winner = models.ForeignKey(GameUser, on_delete=models.CASCADE, related_name='matches_winner')