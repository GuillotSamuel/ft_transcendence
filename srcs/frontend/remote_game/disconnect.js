import {websocket} from "./websocket.js";

// Fonction pour déconnecter le joueur
export async function disconnectGame() {
    if (websocket && websocket.readyState === WebSocket.OPEN) {
        websocket.close(); // Ferme la connexion WebSocket
        alert("Vous avez quitté le match.");
    } else {
        console.warn("WebSocket non connectée. Impossible de se déconnecter.");
    }

    // Masquer le bouton Disconnect après la déconnexion
    const disconnectButton = document.getElementById('disconnect-button');
    disconnectButton.style.display = 'none';
    const local = document.getElementById('local-button');
    const remote = document.getElementById('remote-button');

    local.style.display = 'block';
    remote.style.display = 'block';

    await disconnectPlayer();
}

export async function disconnectPlayer() {
    try {
        const response = await fetch('/api/disconnectPlayer/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        });

        if (response.ok) {
            const data = await response.json();
            console.log("Déconnexion réussie :", data.message);
            alert(data.message);
        } else {
            const errorData = await response.json();
            console.error("Erreur lors de la déconnexion :", errorData.message);
            alert(errorData.message);
        }
    } catch (error) {
        console.error("Erreur réseau :", error);
        alert("Erreur réseau lors de la tentative de déconnexion.");
    }
}