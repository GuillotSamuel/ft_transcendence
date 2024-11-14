export class Paddle {
    constructor(x, y, width, height, canvas) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.topPaddle = y;
        this.downPaddle = this.topPaddle + this.height;
        this.speed = 5;
        this.canvas = canvas;
    }

    draw(ctx) {
        ctx.fillStyle = "#0095DD";
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    move(up, down) {
        if (up && this.y > 0) {
            this.y -= this.speed;
            this.topPaddle -= this.speed;
            this.downPaddle = this.topPaddle + this.height;
        }
        if (down && this.y < this.canvas.height - this.height) {
            this.y += this.speed;
            this.topPaddle += this.speed;
            this.downPaddle = this.topPaddle + this.height;
        }
    }
    
}