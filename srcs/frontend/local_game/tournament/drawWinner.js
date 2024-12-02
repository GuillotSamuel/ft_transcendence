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
