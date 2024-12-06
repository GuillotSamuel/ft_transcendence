export class Score
{
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.scorePlayer1 = 0;
        this.scorePlayer2 = 0;
        this.max_score = 3;
    }

    // Méthode pour dessiner le score dans le canvas
    draw()
    {
        this.ctx.font = "bold 24px 'Arial Black', sans-serif";
        this.ctx.fillStyle = "#333";
        this.ctx.textAlign = "center";

        // Position du centre pour chaque élément
        const centerX = this.canvas.width / 2;

        // Dessiner le score de chaque joueur avec espace autour du séparateur
        this.ctx.fillStyle = "#FF4136"; 
        this.ctx.fillText(`${this.scorePlayer1}`, centerX - 80, 60); 

        this.ctx.fillStyle = "#FFFFFF"; // White for separator
        this.ctx.fillText("|", centerX, 60); 

        this.ctx.fillStyle = "#0074D9"; // Blue for Player 2
        this.ctx.fillText(`${this.scorePlayer2}`, centerX + 80, 60);

    }

    drawWithNames(player1 = "player1", player2= "player2") {
        this.ctx.font = "bold 20px 'Arial Black', sans-serif";
        this.ctx.textAlign = "center";

        const centerX = this.canvas.width / 2;

        this.ctx.fillStyle = "#FF4136";
        this.ctx.fillText(player1, centerX - 80, 30);

        this.ctx.fillStyle = "#0074D9";
        this.ctx.fillText(player2, centerX + 80, 30);

        this.draw();
    }

    incrementPlayer(player)
    {
        if (player == 1)
            this.scorePlayer1++;
        else if (player == 2)
            this.scorePlayer2++;
    }

    resetScore()
    {
        this.scorePlayer1 = 0;
        this.scorePlayer2 = 0;
    }

    check_winner()
    {
        if (this.scorePlayer1 == this.max_score || this.scorePlayer2 == this.max_score)
            return true;
        else
            return false;
    }
}