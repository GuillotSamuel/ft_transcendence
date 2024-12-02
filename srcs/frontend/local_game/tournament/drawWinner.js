export function displayWinner(winner) {
    const canvas = document.getElementById("pong-canvas");
    const ctx = canvas.getContext("2d");

    // Efface tout le canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Ajouter un fond dégradé
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, "#FF7E5F"); // Couleur de départ
    gradient.addColorStop(1, "#FEB47B"); // Couleur d'arrivée
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Définir le style du texte
    ctx.font = "48px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // Ajouter des emojis
    const trophyEmoji = "🏆";
    const fireworksEmoji = "🎉";
    const crownEmoji = "👑";

    // Couleur du texte
    ctx.fillStyle = "#FFFFFF"; // Texte en blanc pour contraster avec le fond

    // Message principal avec emojis
    ctx.fillText(`${trophyEmoji} Congratulations! ${trophyEmoji}`, canvas.width / 2, canvas.height / 2 - 60);

    // Afficher le pseudo du gagnant
    ctx.font = "36px Arial"; // Taille légèrement plus petite pour le pseudo
    ctx.fillText(`${crownEmoji} ${winner} ${crownEmoji}`, canvas.width / 2, canvas.height / 2 - 10);

    // Message secondaire avec emojis
    ctx.font = "24px Arial";
    ctx.fillText(`${fireworksEmoji} You are the champion! ${fireworksEmoji}`, canvas.width / 2, canvas.height / 2 + 40);
}


// Fonction pour afficher les noms des participants sur le canvas avec des effets visuels
export function displayMatchOnCanvas(player1, player2) {
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


export function displayWinnerOnCanvas(winner) {
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

export function displayFinalMatchText() {
    const canvas = document.getElementById("pong-canvas");
    const ctx = canvas.getContext("2d");

    // Définir le style du texte pour "Final Match"
    ctx.font = "bold 36px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillStyle = "#FFFFFF"; // Couleur blanche pour le texte

    // Ajouter le texte
    const text = "🏆 Final Match 🏆";
    ctx.fillText(text, canvas.width / 2, 20); // Afficher le texte à 20px du haut
}