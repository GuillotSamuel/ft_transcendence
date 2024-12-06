import { startLocalGame } from "../gameManager.js";
import { 
    displayMatchOnCanvas, 
    displayWinnerOnCanvas, 
    displayWinner, 
    displayFinalMatchText 
} from "./drawWinner.js";

import {clearRoundDisplay, displayCurrentRound} from "./displayRound.js";

let canvas;
let ctx;

window.clearRoundDisplay = clearRoundDisplay;

export async function playTournament(tournamentTree) {
    canvas = document.getElementById("pong-canvas");
    ctx = canvas.getContext("2d");

    await ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    await processRounds(tournamentTree, ctx);
}

async function processRounds(tournamentTree, ctx) {
    let currentRound = tournamentTree;

    while (currentRound.length > 0) {

        // Jouer tous les matchs du round actuel et obtenir les gagnants
        const nextRoundPlayers = await playCurrentRound(currentRound);

        // Préparer le prochain round
        currentRound = prepareNextRound(nextRoundPlayers);
        clearRoundDisplay();
        displayCurrentRound(currentRound);

        // Vérifier si c'est la finale
        if (isFinalRound(currentRound)) {
            const [player1, player2] = currentRound[0];

            const finalWinner = await playFinalMatch(player1, player2);
            displayWinner(finalWinner);
            const gameButtonDisplay = document.getElementById('gameButtonDisplay');
            gameButtonDisplay.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: center; gap: 20px; margin-bottom: 20px;">
                <button 
                    class="btn btn-secondary btn-lg" 
                    style="padding: 10px 20px; border-radius: 5px;" 
                    onclick="clearRoundDisplay(); tournamentGame()">
                    Return To Menu
                </button>
            </div>`;
            break;
        }
    }
}

// Fonction pour jouer un round
async function playCurrentRound(matches) {
    const winners = [];

    for (const match of matches) {
        const [player1, player2] = match;

        // Affiche les participants sur le canvas
        displayMatchOnCanvas(player1, player2);
        await displayPlayButtonAndWait();
        const winner = await determineMatchWinner(match);
        if (winner) {
            winners.push(winner);
            displayWinnerOnCanvas(winner);
        }
        await displayNextButtonAndWait();
    }

    return winners;
}

// Fonction pour jouer la finale
async function playFinalMatch(player1, player2) {
    displayMatchOnCanvas(player1, player2);
    displayFinalMatchText();
    await displayPlayButtonAndWait();
    const winner = await determineMatchWinner([player1, player2]);
    return winner;
}

// Fonction pour déterminer le gagnant d'un match
async function determineMatchWinner([player1, player2]) {
    if (player1 === "None" && player2 === "None") {
        return null; // Aucun gagnant
    } else if (player1 === "None") {
        return player2; // Joueur 2 gagne par défaut
    } else if (player2 === "None") {
        return player1; // Joueur 1 gagne par défaut
    } else {
        const winner = await startLocalGame(player1, player2, "tour"); // Attendez la résolution de la promesse
        return winner;
    }
}

// Fonction pour préparer le prochain round
function prepareNextRound(players) {
    const nextRound = [];
    for (let i = 0; i < players.length; i += 2) {
        const player1 = players[i] || "None";
        const player2 = players[i + 1] || "None";
        nextRound.push([player1, player2]);
    }
    return nextRound;
}

// Fonction pour vérifier si c'est la finale
function isFinalRound(round) {
    return round.length === 1 && round[0].length === 2;
}



function displayPlayButtonAndWait() {
    return new Promise((resolve) => {
        const gameButtonDisplay = document.getElementById('gameButtonDisplay');

        // Remplacer l'interface pour inclure le bouton
        gameButtonDisplay.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: center; gap: 20px; margin-bottom: 20px;">
                <button 
                    class="btn btn-secondary btn-lg" 
                    style="padding: 10px 20px; border-radius: 5px;" 
                    onclick="clearRoundDisplay(); tournamentGame()">
                    Return To Menu
                </button>
            </div>
            <div style="display: flex; align-items: center; justify-content: center; gap: 20px; margin-bottom: 20px;">
                <button 
                    class="btn btn-primary btn-lg" 
                    style="padding: 10px 20px; border-radius: 5px;" 
                    id="playButton">
                    Play
                </button>
            </div>
        `;
        const playButton = document.getElementById('playButton');
        playButton.addEventListener('click', () => {
            gameButtonDisplay.innerHTML = ''; // Efface le bouton après l'interaction
            resolve(); // Continue l'exécution du code après le clic
        });
    });
}

function displayNextButtonAndWait() {
    return new Promise((resolve) => {
        const gameButtonDisplay = document.getElementById('gameButtonDisplay');

        // Remplacer l'interface pour inclure le bouton
        gameButtonDisplay.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: center; gap: 20px; margin-bottom: 20px;">
                <button 
                    class="btn btn-secondary btn-lg" 
                    style="padding: 10px 20px; border-radius: 5px;" 
                    onclick="clearRoundDisplay(); tournamentGame()">
                    Return To Menu
                </button>
            </div>
            <div style="display: flex; align-items: center; justify-content: center; gap: 20px; margin-bottom: 20px;">
                <button 
                    class="btn btn-success btn-lg" 
                    style="padding: 10px 20px; border-radius: 5px;" 
                    id="nextButton">
                    Next Match
                </button>
            </div>
        `;

        const nextButton = document.getElementById('nextButton');
        nextButton.addEventListener('click', () => {
            gameButtonDisplay.innerHTML = ''; // Efface le bouton après l'interaction
            resolve(); // Continue l'exécution du code après le clic
        });
    });
}