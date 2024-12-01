let finalWinner = null;

export async function playTournament(tournamentTree) {
    let currentRound = tournamentTree;

    console.log("Starting Tournament!");

    // Boucle jusqu'à ce qu'il ne reste qu'un seul gagnant
    while (currentRound.length > 0) {
        console.log("Current Round Matches:", currentRound);

        const nextRound = [];

        // Jouez chaque match dans le round actuel
        for (const match of currentRound) {
            const [player1, player2] = match;

            if (player1 === "None" && player2 === "None") {
                // Les deux joueurs sont "None", pas de gagnant
                continue;
            } else if (player1 === "None") {
                // Le joueur 2 gagne automatiquement
                nextRound.push(player2);
            } else if (player2 === "None") {
                // Le joueur 1 gagne automatiquement
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

        // Si c'est la finale
        if (currentRound.length === 1 && currentRound[0].length === 2) {
            const [player1, player2] = currentRound[0];
            console.log(`Final Match: ${player1} vs ${player2}`);
            alert(`Final Match: ${player1} vs ${player2}`);

            finalWinner = player2 === "None" ? player1 : await playMatch(player1, player2);
            break; // La boucle peut s'arrêter, nous avons un gagnant
        }
    }

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
