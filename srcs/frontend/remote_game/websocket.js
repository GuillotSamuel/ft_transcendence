import {handleWebSocketMessage, handleWebSocketOpen, handleWebSocketClose, handleWebSocketError} from "./handle_websocket.js";
import {playerRole} from "./handle_websocket.js";
import {startListening, stopListening} from "./disconnect.js";
import {handleCanvasClick} from "./find_return_button.js";

export let websocket = null; // Variable globale pour la connexion WebSocket
export let ctx, canvas;
export let isRemoteGameActive = false;

export async function startRemoteGame() {
    const disconnectButton = document.getElementById('disconnect-button');
    canvas = document.getElementById("pong-canvas");
    ctx = canvas.getContext("2d");
    setIsRemoteGameActive(true);
    canvas.removeEventListener('click', handleCanvasClick);
    startListening();
    try {
        // Requête API pour créer ou rejoindre un match
        const response = await fetch('api/manageMatch/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Erreur serveur : ", errorText);
            alert("Erreur côté serveur lors de la création du match.");
            return;
        }
        
        // Initialisation WebSocket
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const websocketURL = `${protocol}//${window.location.host}/ws/game/`;
        websocket = new WebSocket(websocketURL);
    } catch (error) {
        console.error("Erreur lors de l'appel à l'API : ", error);
        alert("Impossible de se connecter au serveur. Vérifiez votre connexion réseau.");
        return;
    }

    // Gestion des événements WebSocket
    websocket.onmessage = handleWebSocketMessage;
    websocket.onopen = () => {
        handleWebSocketOpen();

        // Affiche le bouton Disconnect
        disconnectButton.style.display = 'block';
    };
    websocket.onclose = () => {
        handleWebSocketClose();

        // Masque le bouton Disconnect
        disconnectButton.style.display = 'none';
    };
    websocket.onerror = handleWebSocketError;

    document.addEventListener('keydown', handleRemoteKeyDown);
    document.addEventListener('keyup', handleRemoteKeyUp);
}

export function setIsRemoteGameActive(value) {
    isRemoteGameActive = value;
}

export function getIsRemoteGameActive() {
    return isRemoteGameActive;
}

// Envoi des directions du joueur via WebSocket
export function handleRemoteKeyDown(event) {
    if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
        sendPlayerDirection(event.key === 'ArrowUp' ? -1 : 1);
        event.preventDefault();
    }
}

export function handleRemoteKeyUp(event) {
    if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
        sendPlayerDirection(0);
        event.preventDefault();
    }
}

function sendPlayerDirection(direction) {
    if (websocket && websocket.readyState === WebSocket.OPEN && playerRole !== null) {
        const message = { player_role: playerRole, direction: direction };
        websocket.send(JSON.stringify(message));
    } else {
        console.warn("WebSocket non connectée ou rôle non assigné. Impossible d'envoyer la direction.");
    }
}

// Affiche un message sur le canvas



