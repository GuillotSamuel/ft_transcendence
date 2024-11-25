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
function returnToMainMenu() {
    console.log('Retour à l\'écran principal...');
    const ctx = document.getElementById('pong-canvas').getContext('2d');
    
    // Effacer le canvas
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    
    // Réafficher les boutons principaux ou réinitialiser le canvas selon votre logique
    //manageDisplayGame(); // Supposons que cela réinitialise l'affichage principal
    const localButton = document.getElementById('local-button');
    const remoteButton = document.getElementById('remote-button');

    localButton.style.display = 'block';
    remoteButton.style.display = 'block';
}


export function drawFindGameScreen() {
    const canvas = document.getElementById('pong-canvas');
    if (!canvas) {
        console.error("Canvas avec l'ID 'pong-canvas' introuvable.");
        return;
    }
    const ctx = canvas.getContext('2d');

    const localButton = document.getElementById('local-button');
    const remoteButton = document.getElementById('remote-button');

    // Vérifiez si les boutons existent
    if (!localButton || !remoteButton) {
        console.error('Boutons "local-button" ou "remote-button" introuvables dans le DOM.');
        console.log('DOM actuel:', document.body.innerHTML); // Debugging DOM
        return;
    }

    // Cachez les boutons
    localButton.style.display = 'none';
    remoteButton.style.display = 'none';

    // Effacer le canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dessiner le texte au-dessus des boutons
    ctx.fillStyle = 'white';
    ctx.font = '20px "Press Start 2P", Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Rechercher une Partie', canvas.width / 2, canvas.height / 2 - 60);

    // Définir les dimensions des boutons
    const buttonWidth = 200;
    const buttonHeight = 50;
    const gap = 20;

    // Calculer les positions des boutons pour les centrer
    const totalHeight = buttonHeight * 2 + gap;
    const startY = (canvas.height / 2) - (totalHeight / 2) + 20;

    // Vérifiez si l'objet `buttons` existe
    if (typeof buttons === 'undefined' || !buttons.findGame || !buttons.return) {
        console.error("L'objet 'buttons' ou ses propriétés ('findGame' ou 'return') ne sont pas définis.");
        return;
    }

    // Bouton "Find a Game"
    buttons.findGame.x = (canvas.width - buttonWidth) / 2;
    buttons.findGame.y = startY;
    buttons.findGame.width = buttonWidth;
    buttons.findGame.height = buttonHeight;

    // Bouton "Return"
    buttons.return.x = (canvas.width - buttonWidth) / 2;
    buttons.return.y = startY + buttonHeight + gap;
    buttons.return.width = buttonWidth;
    buttons.return.height = buttonHeight;

    // Dessiner les boutons
    if (typeof drawButton === 'function') {
        drawButton(ctx, buttons.findGame);
        drawButton(ctx, buttons.return);
    } else {
        console.error("La fonction 'drawButton' n'est pas définie.");
    }

    // Ajouter l'écouteur d'événements si ce n'est pas déjà fait
    if (typeof handleCanvasClick === 'function') {
        canvas.removeEventListener('click', handleCanvasClick); // Assurer qu'il n'y a pas de multiples écouteurs
        canvas.addEventListener('click', handleCanvasClick);
    } else {
        console.error("La fonction 'handleCanvasClick' n'est pas définie.");
    }

    // Log final pour le debugging
    console.log("drawFindGameScreen exécuté avec succès.");
}

// Fonction pour dessiner un bouton
function drawButton(ctx, button) {
    // Dessiner le rectangle du bouton

    ctx.fillStyle = 'gray';
    ctx.fillRect(button.x, button.y, button.width, button.height);

    // Dessiner le contour du bouton
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
    ctx.strokeRect(button.x, button.y, button.width, button.height);

    // Dessiner le texte du bouton
    ctx.fillStyle = 'white';
    ctx.font = '16px "Press Start 2P", Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(button.text, button.x + button.width / 2, button.y + button.height / 2);
}


// Fonction pour gérer les clics sur le canvas
function handleCanvasClick(event) {
    const canvas = document.getElementById('pong-canvas');
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    // Calculer la position du clic relative au canvas
    const clickX = (event.clientX - rect.left) * scaleX;
    const clickY = (event.clientY - rect.top) * scaleY;

    // Vérifier si le clic est sur le bouton "Find a Game"
    if (
        clickX >= buttons.findGame.x &&
        clickX <= buttons.findGame.x + buttons.findGame.width &&
        clickY >= buttons.findGame.y &&
        clickY <= buttons.findGame.y + buttons.findGame.height
    ) {
        buttons.findGame.action();
        return;
    }

    // Vérifier si le clic est sur le bouton "Return"
    if (
        clickX >= buttons.return.x &&
        clickX <= buttons.return.x + buttons.return.width &&
        clickY >= buttons.return.y &&
        clickY <= buttons.return.y + buttons.return.height
    ) {
        buttons.return.action();
        return;
    }
}

// Fonction pour rechercher une partie
function findGame() {
    console.log('Recherche d\'une partie...');
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

