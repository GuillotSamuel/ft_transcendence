export class Ball 
{
    constructor(x, y, radius, speedX, speedY, speedIncrement = 0.5) {
        this.x = x;
        this.y = y;
        this.beginX = x;
        this.beginY = y;
        this.radius = radius;
        this.speedX = speedX;
        this.speedY = speedY;
        this.beginSpeedX = speedX; // Used for resetting the ball
        this.beginSpeedY = speedY; // Used for resetting the ball
        this.speedIncrement = speedIncrement; // Amount to increase speed after each paddle hit
        this.lastPaddletouch = "left";
    }

    draw(ctx) 
    {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = "#00FF00";
        ctx.fill();
        ctx.closePath();
    }

    getLastPaddleTouch()
    {
        return this.lastPaddletouch;
    }

    update(canvas, leftPaddle, rightPaddle)
    {
        this.x += this.speedX;
        this.y += this.speedY;

        // Collision with the right paddle
        if (this.x + this.radius >= rightPaddle.x && 
            this.y >= rightPaddle.topPaddle &&
            this.y <= rightPaddle.downPaddle) {
            
            // Adjust speedY based on where the ball hits the paddle
            let offset = this.y - (rightPaddle.topPaddle + rightPaddle.height / 2);
            let angle = offset / (rightPaddle.height / 2); // Normalized to range -1 to 1
            
            this.speedX = -this.speedX; // Reverse x direction
            this.speedY = angle * 4; // Change y direction based on hit position
            this.x = rightPaddle.x - this.radius; // Prevent sticking to the paddle

            // Increase speed slightly after each paddle collision
            this.speedX += this.speedX > 0 ? this.speedIncrement : -this.speedIncrement;
            this.speedY += this.speedY > 0 ? this.speedIncrement : -this.speedIncrement;
            this.lastPaddletouch = "right";
        }
        // Collision with the left paddle (similar to right paddle logic)
        else if (this.x - this.radius <= leftPaddle.x + leftPaddle.width &&
                 this.y >= leftPaddle.topPaddle &&
                 this.y <= leftPaddle.downPaddle) {
            
            let offset = this.y - (leftPaddle.topPaddle + leftPaddle.height / 2);
            let angle = offset / (leftPaddle.height / 2);
            
            this.speedX = -this.speedX;
            this.speedY = angle * 4;
            this.x = leftPaddle.x + leftPaddle.width + this.radius;

            this.speedX += this.speedX > 0 ? this.speedIncrement : -this.speedIncrement;
            this.speedY += this.speedY > 0 ? this.speedIncrement : -this.speedIncrement;
            this.lastPaddletouch = "left";
        }
        // Reverse y direction if the ball hits the top or bottom edges of the canvas
        if (this.y + this.radius > canvas.height || this.y - this.radius < 0) {
            this.speedY = -this.speedY;
        }
    }

    // Static sleep function to create a delay
    static sleep(ms)
    {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Method to reset the ball's position with a 1-second delay
    async resetPosition(player) {
        // Position de départ légèrement aléatoire autour du centre
        this.x = this.beginX + (Math.random() * 20 - 10); // Décalage entre -10 et 10
        this.y = this.beginY + (Math.random() * 20 - 10);
    
        // Réinitialisation temporaire de la vitesse
        this.speedX = 0;
        this.speedY = 0;
    
        // Pause d'une seconde
        await Ball.sleep(1000);
    
        // Définir la nouvelle direction et vitesse
        const randomSpeedX = Math.random() * 0.5 + 2; // Vitesse aléatoire entre 2 et 2.5
        const randomSpeedY = (Math.random() * 4 - 2); // Vitesse aléatoire entre -2 et 2
    
        // Direction en X déterminée par le joueur qui a marqué
        this.speedX = player === 2 ? randomSpeedX : -randomSpeedX;
    
        // Direction en Y avec un angle aléatoire
        this.speedY = randomSpeedY;
    
    }

}