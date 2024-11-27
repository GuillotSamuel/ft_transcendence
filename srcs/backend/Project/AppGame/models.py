from django.db import models
from AppAuthentification.models import GameUser
import uuid
from django.utils.timezone import now  # Pour utiliser la date et l'heure actuelle

class Match(models.Model):
    uuid = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    player1 = models.ForeignKey(GameUser, on_delete=models.CASCADE, related_name='matches_player1', null=True, blank=True)
    player2 = models.ForeignKey(GameUser, on_delete=models.CASCADE, related_name='matches_player2', null=True, blank=True,)
    winner = models.ForeignKey(GameUser, on_delete=models.CASCADE, related_name='matches_winner', null=True, blank=True,)
    status = models.IntegerField(default=0)
    p1_score = models.IntegerField(null=True, blank=True) 
    p2_score = models.IntegerField(null=True, blank=True)
    created_at = models.DateTimeField(default=now)  # Sauvegarde la date et l'heure de création du match