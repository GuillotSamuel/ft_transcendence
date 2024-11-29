// gameManager.js

import { startGame, stopGame } from './game.js';

// État global du jeu
let isGameRunning = false; 
let localGame = false;

// Réinitialise l'état local
export function resetLocal() {
    if (localGame) {
        localGame = false;
    }
}

// Démarre un jeu local
export function startLocalGame() {
    isGameRunning = true;
    localGame = true;
    console.log("Local Game started");
    const gameButtonDisplay = document.getElementById('gameButtonDisplay');
    gameButtonDisplay.innerHTML = '';
    // const remoteButton = document.getElementById('remote-button');
    // remoteButton.style.display = 'none';
    startGame();
}

// Nettoie les ressources si l'utilisateur quitte la page
function resetGameStateOnPageChange() {
    if (isGameRunning) {s
        console.log("Page is being changed or closed. Resetting game state.");
        isGameRunning = false;
    }
    stopGame();
    isGameRunning = false;
}

// Ajout de l'écouteur
export function startListeningForPageChanges() {
    //window.addEventListener('beforeunload', resetGameStateOnPageChange);
    window.addEventListener('hashchange', resetGameStateOnPageChange);
    console.log("Started listening for page changes.");
}

// Suppression de l'écouteur
export function stopListeningForPageChanges() {
    //window.removeEventListener('beforeunload', resetGameStateOnPageChange);
    window.removeEventListener('hashchange', resetGameStateOnPageChange);
    console.log("Stopped listening for page changes.");
}