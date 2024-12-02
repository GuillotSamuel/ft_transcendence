// gameManager.js
import { startGame, stopGame } from './game.js';
import {tournamentGame} from "./tournament/init.js";
// État global du jeu
let isGameRunning = false; 
let localGame = false;

window.stopGame = stopGame;
window.tournamentGame = tournamentGame;

// Démarre un jeu local
export function startLocalGame(player1 = "Player1", player2 = "Player2", type = "None") {
    isGameRunning = true;
    localGame = true;
    const gameButtonDisplay = document.getElementById('gameButtonDisplay');
    
    if (type == "tour"){
        return startGame(type, player1, player2);
    }
    else{
        gameButtonDisplay.innerHTML = `
        <button class="btn btn-danger btn-lg" onclick="stopGame();">Leave</button>
        `;
        startGame("local", player1, player2);
    }
}

export function startCustomGame() {
    isGameRunning = true;
    localGame = true;
    const gameButtonDisplay = document.getElementById('gameButtonDisplay');
    gameButtonDisplay.innerHTML = `
        <button class="btn btn-danger btn-lg" onclick="stopGame()">Leave</button>
    `;
    startGame("custom");
}

// Nettoie les ressources si l'utilisateur quitte la page
function resetGameStateOnPageChange() {
    isGameRunning = false;
    stopGame();
}

// Réinitialise l'état local
export function resetLocal() {
    if (localGame) {
        localGame = false;
    }
}

// Ajout de l'écouteur
export function startListeningForPageChanges() {
    window.addEventListener('hashchange', resetGameStateOnPageChange);
}

// Suppression de l'écouteur
export function stopListeningForPageChanges() {
    window.removeEventListener('hashchange', resetGameStateOnPageChange);
}