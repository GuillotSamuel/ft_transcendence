import { startLocalGame } from "../gameManager.js";
import {displayWinner } from "./drawWinner.js"

let canvas;
let ctx;

export async function playTournament(tournamentTree) {
    canvas = document.getElementById("pong-canvas");
    ctx = canvas.getContext("2d");

    // Efface tout le canvas
    await ctx.clearRect(0, 0, canvas.width, canvas.height);
    console.log("Starting Tournament!");

    await processRounds(tournamentTree, ctx);
}

async function processRounds(tournamentTree, ctx) {
    let currentRound = tournamentTree;

    while (currentRound.length > 0) {
        console.log("Current Round Matches:", currentRound);

        // Attendre que l'utilisateur clique sur "Play" avant de continuer
        

        // Jouer tous les matchs du round actuel et obtenir les gagnants
        const nextRoundPlayers = await playCurrentRound(currentRound);

        // Préparer le prochain round
        currentRound = prepareNextRound(nextRoundPlayers);

        console.log("Next Round Matches:", currentRound);

        // Vérifier si c'est la finale
        if (isFinalRound(currentRound)) {
            const [player1, player2] = currentRound[0];
            console.log(`Final Match: ${player1} vs ${player2}`);
            alert(`Final Match: ${player1} vs ${player2}`);

            const finalWinner = await playFinalMatch(player1, player2);
            displayWinner(finalWinner);
            const gameButtonDisplay = document.getElementById('gameButtonDisplay');
            gameButtonDisplay.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: center; gap: 20px; margin-bottom: 20px;">
                <button 
                    class="btn btn-secondary btn-lg" 
                    style="padding: 10px 20px; border-radius: 5px;" 
                    onclick="tournamentGame()">
                    Return
                </button>
            </div>`;
            break;
        }
    }
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
                    onclick="tournamentGame()">
                    Return
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
                    onclick="tournamentGame()">
                    Return
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


// Fonction pour jouer un round
async function playCurrentRound(matches) {
    const winners = [];

    for (const match of matches) {
        const [player1, player2] = match;

        // Affiche les participants sur le canvas
        displayMatchOnCanvas(player1, player2);
        await displayPlayButtonAndWait();
        const winner = await determineMatchWinner(match);
        console.log (`winner apres gameloop = ${winner}`);
        if (winner) {
            winners.push(winner);
            displayWinnerOnCanvas(winner);
        }
        await displayNextButtonAndWait();
    }

    return winners;
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
        return startLocalGame(player1, player2, "tour"); // Simuler un match
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

// Fonction pour jouer la finale
async function playFinalMatch(player1, player2) {
    if (player2 === "None") {
        return player1; // Joueur 1 gagne par défaut
    }
    //return await playMatch(player1, player2); // Simuler le match final
    return startLocalGame(player1, player2, "tour");
}


// Fonction pour afficher les noms des participants sur le canvas avec des effets visuels
function displayMatchOnCanvas(player1, player2) {
    const canvas = document.getElementById("pong-canvas");
    const ctx = canvas.getContext("2d");

    // Effacer le canvas avant d'afficher les nouveaux noms
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Définir un dégradé de fond
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, "#1a2a6c");
    gradient.addColorStop(0.5, "#b21f1f");
    gradient.addColorStop(1, "#fdbb2d");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Définir le style du texte
    ctx.font = "bold 48px Arial";
    ctx.textAlign = "center";
    ctx.fillStyle = "#ffffff";

    // Ajouter les emojis et afficher les noms des joueurs
    const text = `🏓 ${player1} vs ${player2} 🏓`;
    ctx.fillText(text, canvas.width / 2, canvas.height / 2);

    // Ajouter des particules en arrière-plan (pour un effet de dynamisme)
    const particleCount = 50;
    for (let i = 0; i < particleCount; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const radius = Math.random() * 3;
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.random()})`;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Fonction pour afficher le gagnant sur le canvas avec des effets visuels
function displayWinnerOnCanvas(winner) {
    const canvas = document.getElementById("pong-canvas");
    const ctx = canvas.getContext("2d");

    // Effacer le canvas avant d'afficher le gagnant
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Définir un dégradé de fond
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, "#1a2a6c");
    gradient.addColorStop(0.5, "#4caf50");
    gradient.addColorStop(1, "#fdbb2d");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Définir le style du texte
    ctx.font = "bold 48px Arial";
    ctx.textAlign = "center";
    ctx.fillStyle = "#ffffff";

    // Ajouter les emojis et afficher le gagnant
    const text = `🎉 Winner: ${winner} 🎉`;
    ctx.fillText(text, canvas.width / 2, canvas.height / 2);

    // Ajouter des particules en arrière-plan (pour un effet de dynamisme)
    const particleCount = 50;
    for (let i = 0; i < particleCount; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const radius = Math.random() * 3;
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.random()})`;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
    }
}

