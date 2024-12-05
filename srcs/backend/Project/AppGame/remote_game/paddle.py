class Paddle:
    def __init__(self, canvas_h, canvas_w, paddle_x):
        self.canvas_height = canvas_h
        self.canvas_width = canvas_w

        self.height = 100
        self.width = 10
        self.y = (self.canvas_height - self.height) / 2
        self.x = paddle_x
        self.speed = 280  # Vitesse ajustée pour correspondre à l'original
        self.bottomPaddle = self.y + self.height

    def move(self, direction, delta_time):
        """Déplace le paddle selon la direction (-1: haut, 0: immobile, 1: bas) et delta_time."""
        #print("direction dans move: " + str(direction))
        if direction != 0:
            print("je bouge")
            self.y += direction * self.speed * delta_time
            # Empêcher le paddle de sortir des limites
            self.y = max(0, min(self.y, self.canvas_height - self.height))
            self.bottomPaddle = self.y + self.height


    
