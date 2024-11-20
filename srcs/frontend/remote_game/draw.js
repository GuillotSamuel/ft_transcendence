export function draw_ball(ctx, x, y, radius)
{
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fillStyle = "#00FF00";
    ctx.fill();
    ctx.closePath();
}

export function draw_paddle(ctx, x, y)
{
    const width = 10;
    const height = 100;
    draw(ctx)
    {
        ctx.fillStyle = "#0095DD";
        ctx.fillRect(x, y, width, height);
    }
}

