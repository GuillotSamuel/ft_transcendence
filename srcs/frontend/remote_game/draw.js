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


export function drawMessageOnCanvas(message, color = 'white') {
    const canvas = document.getElementById('pong-canvas');
    if (canvas) {
        const context = canvas.getContext('2d');
        context.clearRect(0, 0, canvas.width, canvas.height);
        
        // Utilisation de la police Press Start 2P
        context.font = '20px "Press Start 2P", Arial';
        context.fillStyle = color; // Définit la couleur du texte
        context.textAlign = 'center';
        
        // Position du message légèrement au-dessus du centre pour laisser de l'espace en dessous
        context.fillText(message, canvas.width / 2, canvas.height / 2 - 20);
    } else {
        console.warn("Canvas introuvable !");
    }
}

// Fonction pour dessiner un bouton interactif
export function createButton(ctx, text, x, y, width, height, onClick, canvas) {
    const button = { x, y, width, height, text };
    let isClicked = false;

    // Dessiner le bouton
    function drawButton() {
        ctx.fillStyle = isClicked ? '#555' : 'gray'; // Changement de couleur si cliqué
        ctx.fillRect(button.x, button.y, button.width, button.height);

        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;
        ctx.strokeRect(button.x, button.y, button.width, button.height);

        ctx.fillStyle = 'white';
        ctx.font = '16px "Press Start 2P", Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(button.text, button.x + button.width / 2, button.y + button.height / 2);
    }

    drawButton();

    // Écouteurs d'événements définis à l'extérieur
    function onMouseDown(event) {
        const rect = canvas.getBoundingClientRect();
        const clickX = event.clientX - rect.left;
        const clickY = event.clientY - rect.top;

        if (
            clickX >= button.x &&
            clickX <= button.x + button.width &&
            clickY >= button.y &&
            clickY <= button.y + button.height
        ) {
            isClicked = true; // Bouton pressé
            drawButton(); // Mettre à jour le bouton
        }
    }

    function onMouseUp(event) {
        const rect = canvas.getBoundingClientRect();
        const clickX = event.clientX - rect.left;
        const clickY = event.clientY - rect.top;

        if (
            clickX >= button.x &&
            clickX <= button.x + button.width &&
            clickY >= button.y &&
            clickY <= button.y + button.height
        ) {
            isClicked = false; // Réinitialiser l'état
            drawButton(); // Mettre à jour le bouton
            canvas.removeEventListener('mousedown', onMouseDown); // Supprimer les écouteurs après clic
            canvas.removeEventListener('mouseup', onMouseUp);
            onClick(); // Appeler la fonction associée
        } else {
            isClicked = false; // Réinitialiser si clic en dehors
            drawButton();
        }
    }

    // Ajouter les écouteurs d'événements
    canvas.addEventListener('mousedown', onMouseDown);
    canvas.addEventListener('mouseup', onMouseUp);
}