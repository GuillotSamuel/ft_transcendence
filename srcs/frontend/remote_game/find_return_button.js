import {startRemoteGame} from "./websocket.js";

// Objet pour stocker les informations des boutons
const buttons = {
    findGame: {
        x: 0, // À définir dynamiquement
        y: 0,
        width: 0,
        height: 0,
        text: 'Find a Game',
        action: findGame
    },
    return: {
        x: 0, // À définir dynamiquement
        y: 0,
        width: 0,
        height: 0,
        text: 'Return',
        action: returnToMainMenu
    }
};

// Fonction pour revenir à l'écran principal

// Fonction pour dessiner un bouton
function drawButton(ctx, button, isClicked = false) {
    ctx.fillStyle = isClicked ? '#555' : 'gray'; // Couleur plus foncée si cliqué
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

// Gestion centralisée des états de clics
const buttonStates = {
    findGame: false,
    return: false
};

// Fonction pour gérer les clics sur le canvas
export function handleCanvasClick(event) {
    const canvas = document.getElementById('pong-canvas');
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const clickX = (event.clientX - rect.left) * scaleX;
    const clickY = (event.clientY - rect.top) * scaleY;

    for (const key in buttons) {
        const button = buttons[key];
        if (
            clickX >= button.x &&
            clickX <= button.x + button.width &&
            clickY >= button.y &&
            clickY <= button.y + button.height
        ) {
            buttonStates[key] = true; // Activer l'effet de clic
            drawButton(canvas.getContext('2d'), button, true);
            setTimeout(() => {
                buttonStates[key] = false; // Réinitialiser l'état
                drawFindGameScreen(); // Réinitialiser l'écran
                button.action(); // Exécuter l'action
            }, 100);
            return;
        }
    }
}

// Fonction pour dessiner l'écran avec boutons mis à jour
export function drawFindGameScreen() {
    const canvas = document.getElementById('pong-canvas');
    if (!canvas) {
        console.error("Canvas avec l'ID 'pong-canvas' introuvable.");
        return;
    }
    const ctx = canvas.getContext('2d');

    const localButton = document.getElementById('local-button');
    const remoteButton = document.getElementById('remote-button');

    if (!localButton || !remoteButton) {
        console.error('Boutons "local-button" ou "remote-button" introuvables dans le DOM.');
        return;
    }

    localButton.style.display = 'none';
    remoteButton.style.display = 'none';

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'white';
    ctx.font = '20px "Press Start 2P", Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Rechercher une Partie', canvas.width / 2, canvas.height / 2 - 60);

    const buttonWidth = 200;
    const buttonHeight = 50;
    const gap = 20;

    const totalHeight = buttonHeight * 2 + gap;
    const startY = (canvas.height / 2) - (totalHeight / 2) + 20;

    buttons.findGame.x = (canvas.width - buttonWidth) / 2;
    buttons.findGame.y = startY;
    buttons.findGame.width = buttonWidth;
    buttons.findGame.height = buttonHeight;

    buttons.return.x = (canvas.width - buttonWidth) / 2;
    buttons.return.y = startY + buttonHeight + gap;
    buttons.return.width = buttonWidth;
    buttons.return.height = buttonHeight;

    drawButton(ctx, buttons.findGame, buttonStates.findGame);
    drawButton(ctx, buttons.return, buttonStates.return);

    canvas.addEventListener('click', handleCanvasClick);
}

// Fonction pour rechercher une partie
function findGame() {
    const ctx = document.getElementById('pong-canvas').getContext('2d');
    // Afficher un message dans le canvas
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.fillStyle = 'white';
    ctx.font = '20px "Press Start 2P", Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Recherche d\'une partie en cours...', ctx.canvas.width / 2, ctx.canvas.height / 2);
    
    // Vous pouvez ajouter ici la logique de matchmaking ou autre
    startRemoteGame();
}

function returnToMainMenu() {

    // Récupérer le canvas
    const canvas = document.getElementById('pong-canvas');
    if (!canvas) {
        console.error("Canvas avec l'ID 'pong-canvas' introuvable.");
        return;
    }
    const ctx = canvas.getContext('2d');

    // Effacer le canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Réafficher les boutons principaux
    const localButton = document.getElementById('local-button');
    const remoteButton = document.getElementById('remote-button');

    if (!localButton || !remoteButton) {
        console.error('Boutons "local-button" ou "remote-button" introuvables dans le DOM.');
        return;
    }

    // Afficher les boutons principaux
    localButton.style.display = 'block';
    remoteButton.style.display = 'block';

    // Réinitialiser les états des boutons
    buttonStates.findGame = false;
    buttonStates.return = false;
}