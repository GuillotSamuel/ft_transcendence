export function displayCurrentRound(currentRound) {
    // Sélectionner l'élément parent où afficher les matchs
    const gameButtonDisplay = document.getElementById('gameButtonDisplay');

    // Supprimer les informations précédentes, si existantes
    let roundInfo = document.getElementById('currentRoundInfo');
    if (roundInfo) {
        roundInfo.remove();
    }

    // Créer un conteneur pour les informations du round
    roundInfo = document.createElement('div');
    roundInfo.id = 'currentRoundInfo';
    roundInfo.style.marginTop = '20px';
    roundInfo.style.textAlign = 'center';
    roundInfo.style.color = '#1a2a6c'; // Texte bleu foncé
    roundInfo.style.fontFamily = 'Arial, sans-serif';

    // Ajouter un titre pour le round
    const title = document.createElement('h3');
    title.textContent = 'Matches Tree';
    title.style.marginBottom = '10px';
    roundInfo.appendChild(title);

    // Ajouter les matchs du round actuel
    currentRound.forEach((match) => {
        const [player1, player2] = match;

        // Créer un conteneur pour chaque match
        const matchContainer = document.createElement('div');
        matchContainer.style.margin = '10px auto';
        matchContainer.style.padding = '10px';
        matchContainer.style.border = '2px solid #FFFFFF';
        matchContainer.style.borderRadius = '8px';
        matchContainer.style.backgroundColor = '#1a2a6c';
        matchContainer.style.color = '#FFFFFF';
        matchContainer.style.width = '150px';
        matchContainer.style.textAlign = 'center';

        // Ajouter les noms des joueurs et "vs" dans des éléments séparés
        const player1Div = document.createElement('div');
        player1Div.textContent = player1;
        const vsDiv = document.createElement('div');
        vsDiv.textContent = 'vs';
        vsDiv.style.fontWeight = 'bold'; // Mettre "vs" en gras
        const player2Div = document.createElement('div');
        player2Div.textContent = player2;

        // Ajouter les éléments au conteneur du match
        matchContainer.appendChild(player1Div);
        matchContainer.appendChild(vsDiv);
        matchContainer.appendChild(player2Div);

        // Ajouter le conteneur du match au conteneur principal
        roundInfo.appendChild(matchContainer);
    });

    // Ajouter le conteneur au DOM, en dessous des boutons
    gameButtonDisplay.insertAdjacentElement('afterend', roundInfo);
}

export function clearRoundDisplay() {
    const currentRoundInfo = document.getElementById('currentRoundInfo');
    if (currentRoundInfo) {
        currentRoundInfo.remove();
    } else {
        console.warn("clearRoundDisplay: Element with ID 'currentRoundInfo' not found");
    }
}
