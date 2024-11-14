from django.db import models
from AppAuthentification.models import GameUser

class Player(models.Model):
    PlayerName = models.CharField(max_length=150, unique=True, blank=False)
    GameUser = models.ForeignKey(GameUser, on_delete=models.CASCADE)


class Match(models.Model):
    MatchName = models.CharField(max_length=150, unique=True, blank=False)
    player1 = models.ForeignKey(Player, on_delete=models.CASCADE)
    player2 = models.ForeignKey(Player, on_delete=models.CASCADE)
    player1_score = models.IntegerField(default=0)
    player2_score = models.IntegerField(default=0)
    winner = models.ForeignKey(Player, on_delete=models.CASCADE)