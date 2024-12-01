let finalWinner = null;

export async function playTournament(tournamentTree) {
    let currentRound = tournamentTree;

    console.log("Starting Tournament!");

    // Boucle jusqu'à ce qu'il ne reste qu'un seul gagnant
    while (currentRound.length > 1) {
        console.log("Current Round Matches:", currentRound);

        // Préparez le prochain round
        const nextRound = [];

        // Jouez chaque match dans le round actuel
        for (let match of currentRound) {
            const [player1, player2] = match;

            // Si l'un des joueurs est "None", l'autre gagne automatiquement
            if (player1 === "None") {
                nextRound.push(player2);
            } else if (player2 === "None") {
                nextRound.push(player1);
            } else {
                // Simulez un match et choisissez un gagnant
                const winner = await playMatch(player1, player2);
                nextRound.push(winner);
            }
        }

        // Passez au prochain round
        currentRound = [];
        for (let i = 0; i < nextRound.length; i += 2) {
            const player1 = nextRound[i] || "None";
            const player2 = nextRound[i + 1] || "None"; 
            currentRound.push([player1, player2]);
        }

        console.log("Next Round Matches:", currentRound);

        // Vérifiez si c'est la finale (juste avant de sortir de la boucle)
        if (currentRound.length === 1) {
            const [player1, player2] = currentRound[0];
            console.log(`Final Match: ${player1} vs ${player2}`);
            alert(`Final Match: ${player1} vs ${player2}`);
            
            if (player2 == "None")
                finalWinner = player1
            else{
                finalWinner = await playMatch(player1, player2); 
            }
        }
    }

    console.log(`Tournament Winner: ${finalWinner}`);
    displayWinner(finalWinner);
}


async function playMatch(player1, player2) {
    return new Promise((resolve) => {
        console.log(`Match: ${player1} vs ${player2}`);
        alert(`Match: ${player1} vs ${player2}`);

        // Choisissez un gagnant aléatoire
        const winner = Math.random() > 0.5 ? player1 : player2;

        console.log(`Winner: ${winner}`);
        alert(`Winner: ${winner}`);

        // Attendez une courte durée avant de résoudre (pour simuler le temps de jeu)
        setTimeout(() => resolve(winner), 1000);
    });
}

function displayWinner(winner) {
    let canvas = document.getElementById("pong-canvas");
    let ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.font = "30px Arial";
    ctx.fillStyle = "gold";
    ctx.textAlign = "center";
    ctx.fillText(`Winner: ${winner}`, canvas.width / 2, canvas.height / 2);
}
