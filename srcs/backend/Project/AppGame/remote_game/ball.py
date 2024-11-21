import random

class Ball:
    def __init__(self, canvas_h, canvas_w):
        self.radius = 10
        
        self.y = canvas_h / 2
        self.x = canvas_w / 2

        self.beginY = self.y
        self.beginX = self.x

        self.speedY = 2
        self.speedX = random.choice([-2, 2])

        self.beginSpeedX = self.speedX 
        self.beginSpeedY = self.speedY

        self.speedIncrement = 0.5

    def update(self, leftPaddle, rightPaddle):
        self.x += self.speedX
        self.y += self.speedY

        if (self.x + self.radius >= rightPaddle.x and
            self.y >= rightPaddle.y and
            self.y <= rightPaddle.bottomPaddle):

            # Calcul du décalage par rapport au centre du paddle
            offset = self.y - (rightPaddle.y + rightPaddle.height / 2)
            angle = offset / (rightPaddle.height / 2)  # Normalisé entre -1 et 1

            # Inverse la direction en X
            self.speedX = -self.speedX
            # Ajuste la direction en Y en fonction de l'endroit touché
            self.speedY = angle * 4  # Change la direction verticale
            # Empêche la balle de coller au paddle
            self.x = rightPaddle.x - self.radius

            # Augmente légèrement la vitesse après chaque collision avec un paddle
            self.speedX += self.speedIncrement if self.speedX > 0 else -self.speedIncrement
            self.speedY += self.speedIncrement if self.speedY > 0 else -self.speedIncrement

            self.lastPaddleTouch = "right"

        # Collision avec le paddle gauche
        elif (self.x - self.radius <= leftPaddle.x + leftPaddle.width and
            self.y >= leftPaddle.y and
            self.y <= leftPaddle.bottomPaddle):

            # Calcul du décalage par rapport au centre du paddle
            offset = self.y - (leftPaddle.y + leftPaddle.height / 2)
            angle = offset / (leftPaddle.height / 2)  # Normalisé entre -1 et 1

            # Inverse la direction en X
            self.speedX = -self.speedX
            # Ajuste la direction en Y en fonction de l'endroit touché
            self.speedY = angle * 4  # Change la direction verticale
            # Empêche la balle de coller au paddle
            self.x = leftPaddle.x + leftPaddle.width + self.radius

            # Augmente légèrement la vitesse après chaque collision avec un paddle
            self.speedX += self.speedIncrement if self.speedX > 0 else -self.speedIncrement
            self.speedY += self.speedIncrement if self.speedY > 0 else -self.speedIncrement

            self.lastPaddleTouch = "left"

        # Collision avec les murs supérieur et inférieur
        if self.y - self.radius <= 0 or self.y + self.radius >= rightPaddle.canvas_height:
            self.speedY = -self.speedY

    def resetPosition(self, player):
        self.x = self.beginX
        self.y = self.beginY
        self.speedX = self.beginSpeedX
        self.speedY = self.beginSpeedY

        # Si le joueur est 2, la vitesse X est positive, sinon elle est négative
        self.speedX = self.beginSpeedX if player == 2 else -self.beginSpeedX
        # Randomisation de la vitesse Y : positive ou négative
        self.speedY = self.beginSpeedY if random.random() < 0.5 else -self.beginSpeedY
        