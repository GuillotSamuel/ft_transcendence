export class Score {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.scorePlayer1 = 0;
        this.scorePlayer2 = 0;
    }

    // Méthode pour dessiner le score dans le canvas
    draw() {
        this.ctx.font = "24px Arial";
        this.ctx.fillStyle = "#333";
        this.ctx.textAlign = "center";

        // Position du centre pour chaque élément
        const centerX = this.canvas.width / 2;

        // Dessiner le score de chaque joueur avec espace autour du séparateur
        this.ctx.fillText(`${this.scorePlayer1}`, centerX - 40, 30);  // Score joueur 1
        this.ctx.fillText("|", centerX, 30);                           // Séparateur
        this.ctx.fillText(`${this.scorePlayer2}`, centerX + 40, 30);  // Score joueur 2
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