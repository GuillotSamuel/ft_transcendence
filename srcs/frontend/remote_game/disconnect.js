import {websocket, setIsRemoteGameActive, getIsRemoteGameActive, handleRemoteKeyDown, handleRemoteKeyUp} from "./websocket.js";
// Fonction pour déconnecter le joueur
export async function disconnectGame() {
    if (!getIsRemoteGameActive()) return;
    setIsRemoteGameActive(false);

    document.removeEventListener('keydown', handleRemoteKeyDown);
    document.removeEventListener('keyup', handleRemoteKeyUp);
    stopListening();

    if (websocket && websocket.readyState === WebSocket.OPEN) {
        websocket.close(); // Ferme la connexion WebSocket
        // alert("Vous avez quitté le match.");
    } else {
        console.warn("WebSocket non connectée. Impossible de se déconnecter.");
    }

    // Masquer le bouton Disconnect après la déconnexion
    const disconnectButton = document.getElementById('disconnect-button');
    if (disconnectButton) 
        disconnectButton.style.display = 'none';
    const local = document.getElementById('local-button');
    const remote = document.getElementById('remote-button');
    if (local)
        local.style.display = 'block';
    if (remote)
        remote.style.display = 'block';

    disconnectPlayerSync();
}

export function disconnectPlayerSync() {
    try {
        const url = '/api/disconnectPlayer/';
        const payload = JSON.stringify({ action: 'disconnect' });

        // Utiliser sendBeacon si disponible
        if (navigator.sendBeacon) {
            navigator.sendBeacon(url, payload);
        } else {
            // Fallback pour les navigateurs qui ne supportent pas sendBeacon
            const xhr = new XMLHttpRequest();
            xhr.open('POST', url, false); // `false` pour une requête synchrone
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.send(payload);
        }
    } catch (error) {
        console.error("Erreur lors de l'envoi de la déconnexion :", error);
    }
}

// Ajout de l'écouteur
export function startListening() {
    window.addEventListener('beforeunload', disconnectGame);
    window.addEventListener('hashchange', disconnectGame);
}

// Suppression de l'écouteur
export function stopListening() {
    window.removeEventListener('beforeunload', disconnectGame);
    window.removeEventListener('hashchange', disconnectGame);
}