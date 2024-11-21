class Paddle:
    def __init__(self, canvas_h, canvas_w, paddle_x):
        self.canvas_height = canvas_h
        self.canvas_width = canvas_w
        
        self.height = 100
        self.width = 10
        self.y = (self.canvas_height - self.height / 2)
        self.x = paddle_x
        self.speed = 5
        self.bottomPaddle = self.y + self.height

        self.p1_direction = 0
        self.p2_direction = 0
        
    
    async def move(self, up, down):
        """Déplace le paddle vers le haut ou vers le bas."""
        if up and self.y > 0:
            self.y -= self.speed
        if down and self.bottomPaddle < self.canvas_height:
            self.y += self.speed

        self.bottomPaddle = self.y + self.height

    
