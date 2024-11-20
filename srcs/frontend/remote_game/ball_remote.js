export class Ball_remote
{
    constructor(x, y, radius) {
        this.x = x;
        this.y = y;
        this.beginX = x;
        this.beginY = y;
        this.radius = radius;
    }

    draw(ctx, ) 
    {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = "#00FF00";
        ctx.fill();
        ctx.closePath();
    }
}

