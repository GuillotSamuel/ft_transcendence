// gameManager.js
import { startGame, stopGame } from './game.js';

// État global du jeu
let isGameRunning = false; 
let localGame = false;


window.stopGame = stopGame;

// Démarre un jeu local
export function startLocalGame() {
    isGameRunning = true;
    localGame = true;
    console.log("Local Game started");
    const gameButtonDisplay = document.getElementById('gameButtonDisplay');
    gameButtonDisplay.innerHTML = `
        <button class="btn btn-danger btn-lg" onclick="stopGame()">Leave</button>
    `;
    startGame("local");
}

export function startCustomGame() {
    isGameRunning = true;
    localGame = true;
    console.log("Local Game started");
    const gameButtonDisplay = document.getElementById('gameButtonDisplay');
    gameButtonDisplay.innerHTML = `
        <button class="btn btn-danger btn-lg" onclick="stopGame()">Leave</button>
    `;
    startGame("custom");
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

// Réinitialise l'état local
export function resetLocal() {
    if (localGame) {
        localGame = false;
    }
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