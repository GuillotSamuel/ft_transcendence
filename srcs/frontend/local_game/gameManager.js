// gameManager.js

import { startGame, stopGame } from './game.js';

let isGameRunning = false; // État global du jeu
let localGame = false;

// function to hide or show button for local game
export function toggleLocalGameButton(show)
{
    const localGameButton = document.querySelector('[data-translate="game-local-button"]');
    if (localGameButton) {
        localGameButton.style.display = show ? 'inline-block' : 'none';
        console.log("button display:", show);
    }
}

// to know if we are in remote or local
export function resetLocal()
{
    if (localGame)
    {
        localGame = false;
        toggleLocalGameButton(true);
    }
}

export function startLocalGame()
{
    isGameRunning = true;
    localGame = true;
    console.log("Local Game started");

    toggleLocalGameButton(false);
    // Démarrer le jeu
    startGame();
}

export function resetGameStateOnPageChange()
{
    if (isGameRunning) {
        console.log("Page changed while the game is running. Resetting game state.");
        isGameRunning = false;
        
    }
    stopGame();
    isGameRunning = false;
}

window.addEventListener('hashchange', resetGameStateOnPageChange);