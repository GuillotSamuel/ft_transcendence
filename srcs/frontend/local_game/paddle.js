export class Paddle
{
    constructor(x, y, width, height, canvas) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.topPaddle = y;
        this.downPaddle = this.topPaddle + this.height;
        this.speed = 5;
        this.canvas = canvas;
        this.color = "#0095DD";
        this.color_default = "#0095DD";
    }

    draw(ctx)
    {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    move(up, down)
    {
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

    add_size()
    {
        this.height = 110;
    }

    reset_size()
    {
        this.height = 80;
    }
    
    reset_color()
    {
        this.color = this.color_default;
    }
}