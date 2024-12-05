
let loadingAnimationId;
export function startLoadingBar() {
    if (loadingAnimationId) {
        // Une animation est déjà en cours, ne démarrez pas une nouvelle
        return;
    }

    const canvas = document.getElementById('pong-canvas');
    if (!canvas) {
        console.warn("Canvas introuvable !");
        return;
    }
    const ctx = canvas.getContext('2d');
    
    // Paramètres de la barre de chargement
    const x = canvas.width / 2 - 100; // Centré horizontalement, largeur de 200px
    const y = canvas.height / 2 + 20; // Positionné 20px en dessous du message
    const width = 200; // Largeur totale de la barre
    const height = 20; // Hauteur de la barre
    let progress = 0; // Progression actuelle
    const speed = 2; // Vitesse de remplissage (pixels par frame)
    
    // Fonction pour dessiner le message et la barre de chargement
    function draw() {
        // Efface la zone de la barre de chargement et du message
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Dessine le message "Waiting for player to join..."
        const message = "Waiting for player to join...";
        ctx.font = '20px "Press Start 2P", Arial';
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.fillText(message, canvas.width / 2, canvas.height / 2 - 20);
        
        // Dessine le contour de la barre de chargement
        ctx.strokeStyle = '#FFFFFF';
        ctx.strokeRect(x, y, width, height);
        
        // Remplit la barre en fonction de la progression
        ctx.fillStyle = '#00FF00';
        ctx.fillRect(x, y, progress, height);
        
        // Met à jour la progression
        progress += speed;
        if (progress > width) {
            progress = 0; // Réinitialise la progression pour boucler l'animation
        }
        
        // Demande la prochaine frame d'animation
        loadingAnimationId = requestAnimationFrame(draw);
    }
    
    // Démarre l'animation
    draw();
}

export function stopLoadingBar() {
    if (loadingAnimationId) {
        cancelAnimationFrame(loadingAnimationId);
        loadingAnimationId = null;
    }
    
    // Efface la barre de chargement et redessine le message sans la barre
    const canvas = document.getElementById('pong-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
}
