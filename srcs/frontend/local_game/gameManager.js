// gameManager.js

import { startGame, stopGame } from './game.js';

let isGameRunning = false; // État global du jeu

export function startLocalGame() {
    isGameRunning = true;
    console.log("Local Game started");

    // Démarrer le jeu
    startGame();

    // Exemple : Terminer le jeu après 5 secondes pour tester (remplace par ta logique)
    setTimeout(() => {
        endLocalGame();
    }, 5000);
}

export function endLocalGame() {
    isGameRunning = false;
    console.log("Local Game ended");
}

export function resetGameStateOnPageChange() {
    if (isGameRunning) {
        console.log("Page changed while the game is running. Resetting game state.");
        isGameRunning = false;
    }
    stopGame();
}

window.addEventListener('hashchange', resetGameStateOnPageChange);