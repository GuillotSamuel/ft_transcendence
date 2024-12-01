import { clearCanvas } from "../game.js";
import {playTournament} from "./play.js";

window.clearCanvas = clearCanvas;
window.generateAliasFields = generateAliasFields;
window.submitAliases = submitAliases;
window.tournamentGame = tournamentGame;

let canvas;
let ctx;
let tournamentTree = null;

export function tournamentGame() {
    canvas = document.getElementById("pong-canvas");
    ctx = canvas.getContext("2d");
    canvas.width = 600;
    canvas.height = 400;

    if (!ctx || !canvas) {
        console.warn("Canvas or context not initialized. Skipping cleanup.");
        return;
    }

    // Effacez le canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Configurez le texte pour les instructions
    ctx.font = "20px 'Press Start 2P', Arial";
    ctx.fillStyle = "#FFFFFF";
    ctx.textAlign = "center";

    // Affichez les instructions sur plusieurs lignes
    const instructions = [
        "Welcome to the Tournament!",
        "1. Please enter the number of participants",
        "Max players: 8",
        "2. The alias for each player.",
        "This is a single-elimination tournament.",
        "The final will be played in BO3."
    ];

    // Positionnement dynamique pour le texte
    let y = 100;
    instructions.forEach((line) => {
        ctx.fillText(line, canvas.width / 2, y);
        y += 40; // Espace entre les lignes
    });

    const gameButtonDisplay = document.getElementById('gameButtonDisplay');

    // Remplacez tout le contenu par les options de participants
    gameButtonDisplay.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: center; gap: 50px;">
            <div id="participantSelection" style="display: flex; align-items: center; gap: 10px;">
                <label for="numParticipants" style="color: white; font-size: 16px;">Participants:</label>
                <select 
                    id="numParticipants" 
                    style="width: 100px; padding: 5px; border-radius: 5px; border: 1px solid #ccc;">
                    <option value="3">3</option>
                    <option value="4" selected>4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                    <option value="8">8</option>
                </select>
                <button id="startTournamentBtn" class="btn btn-primary btn-lg" onclick="generateAliasFields()">Start</button>
            </div>
            <button class="btn btn-secondary btn-lg" onclick="clearCanvas(); displaySecondaryButtons()">Return</button>
        </div>
        <div id="aliasInputsContainer" style="margin-top: 20px; display: flex; flex-direction: column; align-items: center; gap: 10px;"></div>
    `;
}

export function generateAliasFields() {
    const numParticipants = document.getElementById('numParticipants').value;
    const gameButtonDisplay = document.getElementById('gameButtonDisplay');

    // Remplacez le contenu actuel par les boutons Return et Submit Aliases côte à côte
    gameButtonDisplay.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: center; gap: 20px; margin-bottom: 20px;">
            <button 
                class="btn btn-secondary btn-lg" 
                style="padding: 10px 20px; border-radius: 5px;" 
                onclick="tournamentGame()">
                Return
            </button>
            <button 
                id="submitAliasesBtn"
                class="btn btn-primary btn-lg"
                style="padding: 10px 20px; border-radius: 5px;" 
                onclick="submitAliases()">
                Submit Aliases
            </button>
        </div>
        <div id="aliasInputsContainer" style="display: flex; flex-direction: column; align-items: center; gap: 10px;"></div>
    `;

    // Récupérez le conteneur aliasInputsContainer
    const aliasInputsContainer = document.getElementById('aliasInputsContainer');

    // Effacez les champs précédents si nécessaire
    aliasInputsContainer.innerHTML = '';

    // Générez dynamiquement les champs de saisie pour les alias
    for (let i = 1; i <= numParticipants; i++) {
        const aliasDiv = document.createElement('div');
        aliasDiv.style.display = 'flex';
        aliasDiv.style.alignItems = 'center';
        aliasDiv.style.gap = '10px';

        aliasDiv.innerHTML = `
            <label for="player${i}Alias" style="color: white; font-size: 16px;">Player ${i} Alias:</label>
            <input 
                type="text" 
                id="player${i}Alias" 
                name="player${i}Alias" 
                style="width: 200px; padding: 5px; border-radius: 5px; border: 1px solid #ccc;" 
                oninput="this.value = this.value.replace(/[^a-zA-Z]/g, '');"
            >
        `;
        aliasInputsContainer.appendChild(aliasDiv);
    }
}
export function submitAliases() {
    console.log("submitAliases called");

    const aliasInputs = document.querySelectorAll('[id^="player"]');
    const aliases = [];

    // Récupérer les alias depuis les champs de saisie
    aliasInputs.forEach(input => {
        const alias = input.value.trim();
        if (alias) {
            aliases.push(alias);
        }
    });
    console.log("Collected aliases:", aliases);

    // Vérifier si tous les participants ont bien un alias
    if (aliases.length < aliasInputs.length) {
        alert("Please ensure all players have entered their aliases.");
        return;
    }

    // Générer l'arbre de tournoi
    tournamentTree = generateTournamentTree(aliases);
    console.log("Generated Tournament Tree:", tournamentTree);

    // Récupérer les deux premiers joueurs
    const firstMatch = tournamentTree[0]; // Supposons que le premier match est le premier élément
    const player1 = firstMatch[0]; // Premier joueur
    const player2 = firstMatch[1]; // Deuxième joueur


    // Afficher l'arbre de tournoi
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.font = "30px Arial";
    ctx.textAlign = "center";

    // Afficher "It's time!" en blanc
    ctx.fillStyle = "white";
    ctx.fillText("It's time!", canvas.width / 2, canvas.height / 2 - 20);

    // Afficher player1 en rouge
    ctx.fillStyle = "red";
    ctx.fillText(player1, canvas.width / 2 - 50, canvas.height / 2 + 20); // Décaler légèrement pour séparer les noms

    // Ajouter "vs" en blanc
    ctx.fillStyle = "white";
    ctx.fillText("vs", canvas.width / 2, canvas.height / 2 + 20);

    // Afficher player2 en bleu
    ctx.fillStyle = "blue";
    ctx.fillText(player2, canvas.width / 2 + 50, canvas.height / 2 + 20);

    // Dessiner un bouton "Play"
    drawPlayButton(ctx, canvas, canvas.width / 2 - 50, canvas.height / 2 + 50, 100, 40, "Play");
}

// Fonction pour créer l'arbre de tournoi
function generateTournamentTree(players) {
    // Mélanger les joueurs pour rendre le tournoi aléatoire
    players = shuffleArray(players);

    // Si le nombre de joueurs n'est pas une puissance de 2, ajoutez des "Bye" (places vides)
    const nextPowerOfTwo = Math.pow(2, Math.ceil(Math.log2(players.length)));
    while (players.length < nextPowerOfTwo) {
        players.push("None"); // Les joueurs contre "Bye" avancent automatiquement
    }

    // Retourner un arbre sous forme de paires
    const tournamentTree = [];
    for (let i = 0; i < players.length; i += 2) {
        tournamentTree.push([players[i], players[i + 1]]);
    }

    return tournamentTree;
}


// Fonction pour mélanger les joueurs aléatoirement
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}


export function drawPlayButton(ctx, canvas, x, y, width, height, text) {
    // Dessiner le rectangle
    ctx.fillStyle = "green";
    ctx.fillRect(x, y, width, height);

    // Ajouter le texte au centre du bouton
    ctx.font = "20px Arial";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.fillText(text, x + width / 2, y + height / 2 + 7);

    // Ajouter un événement pour détecter les clics sur le bouton
    canvas.addEventListener("click", function handleCanvasClick(event) {
        const rect = canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;

        // Vérifier si le clic est dans les limites du bouton
        if (
            mouseX >= x &&
            mouseX <= x + width &&
            mouseY >= y &&
            mouseY <= y + height
        ) {
            console.log("Play button clicked!");
            playTournament(tournamentTree);
            // Ajouter la logique du bouton ici
            canvas.removeEventListener("click", handleCanvasClick);
        }
    });
}
