from django.contrib.auth.models import AbstractUser
from django.db import models

class GameUser(AbstractUser):
    score = models.IntegerField(default=0)
