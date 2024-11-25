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

    ctx.fillStyle = "#0095DD";
    ctx.fillRect(x, y, width, height);
}

export function draw_score(canvas, ctx, scorePlayer1, scorePlayer2) {
    // Effacez uniquement la zone où les scores sont affichés

    // Définir les styles de texte
    ctx.font = "bold '48px 'Press Start 2P', Arial'";
    ctx.textAlign = "center";

    const centerX = canvas.width / 2; // Position centrale du canvas

    // Dessiner le score du joueur 1
    ctx.fillStyle = "#FF4136"; // Rouge pour le joueur 1
    ctx.fillText(`${scorePlayer1}`, centerX - 80, 60);

    // Dessiner le séparateur
    ctx.fillStyle = "#FFFFFF"; // Blanc pour le séparateur
    ctx.fillText("|", centerX, 60);

    // Dessiner le score du joueur 2
    ctx.fillStyle = "#0074D9"; // Bleu pour le joueur 2
    ctx.fillText(`${scorePlayer2}`, centerX + 80, 60);
}


export function drawMessageOnCanvas(message) {
    const canvas = document.getElementById('pong-canvas');
    if (canvas) {
        const context = canvas.getContext('2d');
        context.clearRect(0, 0, canvas.width, canvas.height);
        
        // Utilisation de la police Press Start 2P
        context.font = '20px "Press Start 2P", Arial';
        context.fillStyle = 'white';
        context.textAlign = 'center';
        
        // Position du message légèrement au-dessus du centre pour laisser de l'espace en dessous
        context.fillText(message, canvas.width / 2, canvas.height / 2 - 20);
    } else {
        console.warn("Canvas introuvable !");
    }
}
