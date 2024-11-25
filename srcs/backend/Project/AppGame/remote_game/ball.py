import random
import asyncio

class Ball:
    def __init__(self, canvas_height, canvas_width, radius=10, speedX=125, speedY=75, speedIncrement=25):
        self.canvas_height = canvas_height
        self.canvas_width = canvas_width
        self.radius = radius
        self.x = canvas_width / 2
        self.y = canvas_height / 2
        self.beginX = self.x
        self.beginY = self.y
        self.speedX = speedX  # Pixels par frame
        self.speedY = speedY  # Pixels par frame
        self.beginSpeedX = speedX
        self.beginSpeedY = speedY
        self.speedIncrement = speedIncrement  # Pixels par frame

    def update(self, leftPaddle, rightPaddle, delta_time):
        self.x += self.speedX * delta_time
        self.y += self.speedY * delta_time

        # Collision avec le paddle droit
        if (self.x + self.radius >= rightPaddle.x and
            self.y >= rightPaddle.y and
            self.y <= rightPaddle.y + rightPaddle.height):

            # Ajuster speedY en fonction de l'endroit où la balle frappe le paddle
            offset = self.y - (rightPaddle.y + rightPaddle.height / 2)
            angle = offset / (rightPaddle.height / 2)  # Normalisé entre -1 et 1

            self.speedX = -self.speedX  # Inverser la direction X
            self.speedY = angle * 4  # Changer la direction Y en fonction de la position d'impact
            self.x = rightPaddle.x - self.radius  # Empêcher la balle de coller au paddle

            # Augmenter légèrement la vitesse après chaque collision avec un paddle
            self.speedX += self.speedIncrement if self.speedX > 0 else -self.speedIncrement
            self.speedY += self.speedIncrement if self.speedY > 0 else -self.speedIncrement

        # Collision avec le paddle gauche
        elif (self.x - self.radius <= leftPaddle.x + leftPaddle.width and
              self.y >= leftPaddle.y and
              self.y <= leftPaddle.y + leftPaddle.height):

            offset = self.y - (leftPaddle.y + leftPaddle.height / 2)
            angle = offset / (leftPaddle.height / 2)

            self.speedX = -self.speedX
            self.speedY = angle * 4
            self.x = leftPaddle.x + leftPaddle.width + self.radius

            self.speedX += self.speedIncrement if self.speedX > 0 else -self.speedIncrement
            self.speedY += self.speedIncrement if self.speedY > 0 else -self.speedIncrement

        # Inverser la direction Y si la balle touche le haut ou le bas du canvas
        if self.y + self.radius > self.canvas_height or self.y - self.radius < 0:
            self.speedY = -self.speedY

    def resetPosition(self, player):
        # Réinitialiser la position initiale et la vitesse de la balle
        self.x = self.beginX
        self.y = self.beginY
        self.speedX = 2
        self.speedY = 2

        # Définir la vitesse et la direction après la pause
        self.speedX = self.beginSpeedX if player == 2 else -self.beginSpeedX
        self.speedY = self.beginSpeedY if random.random() < 0.5 else -self.beginSpeedY


        