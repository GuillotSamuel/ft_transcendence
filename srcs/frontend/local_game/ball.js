export class Ball {
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
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = "#0095DD";
        ctx.fill();
        ctx.closePath();
    }

    update(canvas, leftPaddle, rightPaddle) {
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
        }
        // Reverse y direction if the ball hits the top or bottom edges of the canvas
        if (this.y + this.radius > canvas.height || this.y - this.radius < 0) {
            this.speedY = -this.speedY;
        }
    }
    
    // Static sleep function to create a delay
    static sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Method to reset the ball's position with a 1-second delay
    async resetPosition(player) {
        // Set initial position and temporarily stop the ball
        this.x = this.beginX;
        this.y = this.beginY;
        this.speedX = 0;
        this.speedY = 0;

        // Wait for 1 second
        await Ball.sleep(1000);

        // Set the speed and direction after the pause
        this.speedX = player === 2 ? this.beginSpeedX : -this.beginSpeedX;
        this.speedY = Math.random() < 0.5 ? this.beginSpeedY : -this.beginSpeedY;
    }
    
}