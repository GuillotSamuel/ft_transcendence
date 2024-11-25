// gameManager.js

import { startGame, stopGame } from './game.js';

// État global du jeu
let isGameRunning = false; 
let localGame = false;

// Fonction pour afficher ou masquer le bouton de jeu local
export function toggleLocalGameButton(show) {
    const localGameButton = document.querySelector('[data-translate="game-local-button"]');
    if (localGameButton) {
        localGameButton.style.display = show ? 'inline-block' : 'none';
        console.log("Button display:", show ? "Visible" : "Hidden");
    }
}

// Réinitialise l'état local
export function resetLocal() {
    if (localGame) {
        localGame = false;
        toggleLocalGameButton(true);
    }
}

// Démarre un jeu local
export function startLocalGame() {
    isGameRunning = true;
    localGame = true;
    console.log("Local Game started");
    toggleLocalGameButton(false);
    startGame();
}

// Nettoie les ressources si l'utilisateur quitte la page
function resetGameStateOnPageChange() {
    if (isGameRunning) {
        console.log("Page is being changed or closed. Resetting game state.");
        isGameRunning = false;
    }
    stopGame();
    isGameRunning = false;
}

// Ajout de l'écouteur
export function startListeningForPageChanges() {
    window.addEventListener('beforeunload', resetGameStateOnPageChange);
    window.addEventListener('hashchange', resetGameStateOnPageChange);
    console.log("Started listening for page changes.");
}

// Suppression de l'écouteur
export function stopListeningForPageChanges() {
    window.removeEventListener('beforeunload', resetGameStateOnPageChange);
    window.removeEventListener('hashchange', resetGameStateOnPageChange);
    console.log("Stopped listening for page changes.");
}