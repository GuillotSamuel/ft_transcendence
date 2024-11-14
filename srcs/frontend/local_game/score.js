export class Score {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.scorePlayer1 = 0;
        this.scorePlayer2 = 0;
    }

    // Méthode pour dessiner le score dans le canvas
    draw() {
        this.ctx.font = "bold 48px 'Arial Black', sans-serif";
        this.ctx.fillStyle = "#333";
        this.ctx.textAlign = "center";

        // Position du centre pour chaque élément
        const centerX = this.canvas.width / 2;

        // Dessiner le score de chaque joueur avec espace autour du séparateur
        this.ctx.fillStyle = "#FF4136"; // Red for Player 1
        this.ctx.fillText(`${this.scorePlayer1}`, centerX - 80, 60);  // Score joueur 1

        this.ctx.fillStyle = "#FFFFFF"; // White for separator
        this.ctx.fillText("|", centerX, 60);                           // Séparateur

        this.ctx.fillStyle = "#0074D9"; // Blue for Player 2
        this.ctx.fillText(`${this.scorePlayer2}`, centerX + 80, 60);  // Score joueur 2

    }

    // Méthodes pour mettre à jour les scores
    incrementPlayer1() {
        this.scorePlayer1++;
    }

    incrementPlayer2() {
        this.scorePlayer2++;
    }

    resetScore() {
        this.scorePlayer1 = 0;
        this.scorePlayer2 = 0;
    }
}