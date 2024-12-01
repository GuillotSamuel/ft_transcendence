import {clearCanvas} from "../game.js";

window.clearCanvas = clearCanvas
window.generateAliasFields = generateAliasFields
//window.submitAliases = submitAliases
window.tournamentGame = tournamentGame

export function tournamentGame() {
    let canvas = document.getElementById("pong-canvas");
    let ctx = canvas.getContext("2d");
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

    // Remplacez tout le contenu par uniquement le bouton de retour
    
    gameButtonDisplay.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: center; gap: 50px;">
            <div id="participantSelection" style="display: flex; align-items: center; gap: 10px;">
                <label for="numParticipants" style="color: white; font-size: 16px;">Participants:</label>
                <select 
                    id="numParticipants" 
                    style="width: 100px; padding: 5px; border-radius: 5px; border: 1px solid #ccc;">
                    <option value="3">3</option>
                    <option value="4">4</option>
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

