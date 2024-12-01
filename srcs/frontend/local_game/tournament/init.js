import { clearCanvas } from "../game.js";

window.clearCanvas = clearCanvas;
window.generateAliasFields = generateAliasFields;
window.submitAliases = submitAliases;
window.tournamentGame = tournamentGame;

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
    const tournamentTree = generateTournamentTree(aliases);
    console.log("Generated Tournament Tree:", tournamentTree);

    // Générer les rounds pour l'affichage
    const rounds = generateRounds(tournamentTree);

    // Afficher l'arbre de tournoi
    displayTournamentTree(rounds);
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

// Fonction pour générer les rounds à partir de l'arbre de tournoi
function generateRounds(tournamentTree) {
    const rounds = [];
    rounds.push(tournamentTree);

    let currentRound = tournamentTree;
    while (currentRound.length > 1) {
        const nextRound = [];
        for (let i = 0; i < currentRound.length / 2; i++) {
            nextRound.push(['', '']); // Placeholder pour les prochains matchs
        }
        rounds.push(nextRound);
        currentRound = nextRound;
    }

    return rounds;
}
function displayTournamentTree(rounds) {
    // Effacez le contenu existant
    const gameButtonDisplay = document.getElementById('gameButtonDisplay');
    gameButtonDisplay.innerHTML = '';

    // Créez le conteneur principal pour le bracket
    const bracketContainer = document.createElement('div');
    bracketContainer.id = 'bracketContainer';
    bracketContainer.style.display = 'flex';
    bracketContainer.style.justifyContent = 'center';
    bracketContainer.style.alignItems = 'flex-start';
    bracketContainer.style.gap = '20px';
    bracketContainer.style.marginTop = '20px';

    // Pour chaque round, créez une colonne
    rounds.forEach((round, roundIndex) => {
        const roundColumn = document.createElement('div');
        roundColumn.classList.add('round');
        roundColumn.style.display = 'flex';
        roundColumn.style.flexDirection = 'column';
        roundColumn.style.alignItems = 'center';

        // Calculer l'espacement supérieur pour décaler les rounds
        if (roundIndex == 1) {
            const offset = Math.pow(2, roundIndex - 1) * 50; // 60 est la hauteur de la case
            roundColumn.style.marginTop = `${offset}px`;
        }

        else if (roundIndex == 2) {
            const offset = Math.pow(2, roundIndex - 1) * 60; // 60 est la hauteur de la case
            roundColumn.style.marginTop = `${offset}px`;
        }

        // Titre du round
        const roundTitle = document.createElement('div');
        if (roundIndex === rounds.length - 1) {
            roundTitle.textContent = 'Winner';
        } else {
            roundTitle.textContent = `Round ${roundIndex + 1}`;
        }
        roundTitle.style.color = 'white';
        roundTitle.style.fontSize = '18px';
        roundTitle.style.marginBottom = '20px';
        roundColumn.appendChild(roundTitle);

        // Pour chaque match dans le round
        round.forEach((match, matchIndex) => {
            const matchContainer = document.createElement('div');
            matchContainer.classList.add('matchContainer');
            matchContainer.style.display = 'flex';
            matchContainer.style.flexDirection = 'column';
            matchContainer.style.alignItems = 'center';
            

            // Calculer l'espacement entre les matchs
            const spacing = Math.pow(2, roundIndex) * 60; // Ajustement de l'espacement entre les matchs
            if (matchIndex > 0) {
                matchContainer.style.marginTop = `${spacing - 30}px`;
            }

            const matchDiv = document.createElement('div');
            matchDiv.classList.add('match');
            matchDiv.style.display = 'flex';
            matchDiv.style.flexDirection = 'column';
            matchDiv.style.alignItems = 'center';
            matchDiv.style.justifyContent = 'center';
            matchDiv.style.width = '150px';
            matchDiv.style.height = '60px';
            matchDiv.style.border = '1px solid #ccc';
            matchDiv.style.borderRadius = '5px';
            matchDiv.style.padding = '5px';
            matchDiv.style.backgroundColor = '#333';

            // Joueur 1
            const player1 = document.createElement('div');
            player1.textContent = match[0] || '';
            player1.style.color = 'white';
            player1.style.fontSize = '14px';

            // Joueur 2
            const player2 = document.createElement('div');
            player2.textContent = match[1] || '';
            player2.style.color = 'white';
            player2.style.fontSize = '14px';

            matchDiv.appendChild(player1);
            matchDiv.appendChild(player2);

            matchContainer.appendChild(matchDiv);
            roundColumn.appendChild(matchContainer);
        });

        bracketContainer.appendChild(roundColumn);
    });

    // Ajoutez le bracket au DOM
    gameButtonDisplay.appendChild(bracketContainer);
}


// Fonction pour mélanger les joueurs aléatoirement
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}
