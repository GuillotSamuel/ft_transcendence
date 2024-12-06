import { clearCanvas } from "../game.js";
import {playTournament} from "./play.js";
import {displayCurrentRound, clearRoundDisplay} from "./displayRound.js";

window.clearCanvas = clearCanvas;
window.generateAliasFields = generateAliasFields;
window.submitAliases = submitAliases;
window.tournamentGame = tournamentGame;
window.clearRoundDisplay = clearRoundDisplay;

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
        "2. Enter an alias for each player.",
        "(max length: 8 characters)",
        "This is a single-elimination tournament.",
        "GL, HF"
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
            <label for="player${i}Alias" style="color: white; font-size: 16px;">Player ${i}</label>
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

    const aliasInputs = document.querySelectorAll('[id^="player"]');
    const aliases = [];

    // Récupérer les alias depuis les champs de saisie
    aliasInputs.forEach(input => {
        const alias = input.value.trim();
        if (alias.length > 8) {
            return;
        }
        if (alias) {
            aliases.push(alias);
        }
    });

    // Vérifier si tous les participants ont bien un alias
    if (aliases.length < aliasInputs.length) {
        alert("Please ensure all players have entered their aliases.");
        return;
    }

    const uniqueAliases = new Set(aliases);
    if (uniqueAliases.size < aliases.length) {
        alert("Duplicate aliases detected. Please ensure all players have unique aliases.");
        return;
    }

    const gameButtonDisplay = document.getElementById('gameButtonDisplay');
    
    // Remplacer l'interface pour inclure le bouton Return
    gameButtonDisplay.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: center; gap: 20px; margin-bottom: 20px;">
            <button 
                class="btn btn-secondary btn-lg" 
                style="padding: 10px 20px; border-radius: 5px;" 
                onclick="clearRoundDisplay(); tournamentGame()">
                Return
            </button>
        </div>
    `;

    // Générer l'arbre de tournoi
    tournamentTree = generateTournamentTree(aliases);

    // Afficher l'arbre de tournoi
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.font = "30px Arial";
    ctx.textAlign = "center";

    // Afficher un message indiquant que le tournoi est prêt
    ctx.fillStyle = "white";
    ctx.fillText("The tournament is ready!", canvas.width / 2, canvas.height / 2 - 40);
    ctx.fillText("Click 'Start Tournament' to begin!", canvas.width / 2, canvas.height / 2);
    displayCurrentRound(tournamentTree);
    drawPlayButton(ctx, canvas, canvas.width / 2 - 85, canvas.height / 2 + 30, 180, 50, "Start Tournament");
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
    ctx.fillStyle = "grey";
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
            playTournament(tournamentTree);
            // Ajouter la logique du bouton ici
            canvas.removeEventListener("click", handleCanvasClick);
        }
    });
}

