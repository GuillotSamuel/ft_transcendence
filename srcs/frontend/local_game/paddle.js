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
        this.color = "#0095DD";
        this.reverse_move = false;

        // Propriétés pour gérer les bonus/malus
        this.defaultHeight = height; // Hauteur par défaut
        this.defaultColor = "#0095DD"; // Couleur par défaut
        this.bonusActive = false; // Indique si un bonus/malus est actif
        this.bonusTimeout = null; // Stocke le timer pour le bonus/malus
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    move(up, down) {
        if (this.reverse_move) {
            // reverse
            if (up && this.y < this.canvas.height - this.height) {
                this.y += this.speed;
                this.topPaddle += this.speed;
                this.downPaddle = this.topPaddle + this.height;
            }
            if (down && this.y > 0) {
                this.y -= this.speed;
                this.topPaddle -= this.speed;
                this.downPaddle = this.topPaddle + this.height;
            }
        } else {
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

    set_size(size) {
        this.height = size;
    }

    reset_size() {
        this.height = this.defaultHeight;
    }

    set_color(color) {
        this.color = color;
    }

    reset_color() {
        this.color = this.defaultColor;
    }

    applyBonus(size, color, duration) {
        // Annuler tout bonus/malus en cours
        this.resetBonus();

        // Appliquer le nouveau bonus
        this.set_size(size);
        this.set_color(color);
        this.bonusActive = true;

        // Planifier la réinitialisation après `duration` ms
        this.bonusTimeout = setTimeout(() => this.resetBonus(), duration);
    }

    reverse(color, duration) {
        // Annuler tout bonus/malus en cours
        this.resetBonus();

        // Appliquer le malus d'inversion
        this.reverse_move = true;
        this.set_color(color);
        this.bonusActive = true;

        // Planifier la réinitialisation après `duration` ms
        this.bonusTimeout = setTimeout(() => this.resetBonus(), duration);
    }

    resetBonus() {
        if (this.bonusTimeout) {
            clearTimeout(this.bonusTimeout); // Annuler le timer précédent si actif
            this.bonusTimeout = null;
        }
        this.reset_size();
        this.reset_color();
        this.bonusActive = false;
        this.reverse_move = false;
    }
}
