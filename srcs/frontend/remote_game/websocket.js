import {draw_ball, draw_paddle, draw_score} from './draw.js';
import {startLoadingBar, stopLoadingBar} from './load_bar.js';

let websocket = null; // Variable globale pour la connexion WebSocket
let playerRole = null; // Stocke le rôle du joueur
let canvas, ctx; // Variables pour le canvas et le contexte


export async function startRemoteGame() {
    const disconnectButton = document.getElementById('disconnect-button');
    canvas = document.getElementById("pong-canvas");
    ctx = canvas.getContext("2d");
    
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
        console.log("WebSocket connecté !");
        handleWebSocketOpen();

        // Affiche le bouton Disconnect
        disconnectButton.style.display = 'block';
    };
    websocket.onclose = () => {
        console.log("WebSocket déconnecté !");
        handleWebSocketClose();

        // Masque le bouton Disconnect
        disconnectButton.style.display = 'none';
    };
    websocket.onerror = handleWebSocketError;
}

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

// Gestion des messages WebSocket
function handleWebSocketMessage(event) {
    try {
        const data = JSON.parse(event.data);

        if (!data.event_name) {
            console.warn("Message mal formé reçu :", data);
            return;
        }

        switch (data.event_name) {
            case 'ASSIGN_ROLE':
                handleAssignRole(data.data);
                break;

            case 'PRINTFORUSER':
                handlePrintForUser(data.data);
                break;
                
            case 'MATCH_READY':
                handleMatchReady(data.data);
                break;

            case 'GAME_STATE_UPDATE':
                handleGameStateUpdate(data.data);
                break;

            case 'GAME_START':
                handleGameStart(data.data);
                break;

            case 'PLAYER_DISCONNECTED':
                console.log(`Le joueur ${data.data.player_number} s'est déconnecté.`);
                drawMessageOnCanvas(`Le joueur ${data.data.player_number} s'est déconnecté.`);
                break;

            default:
                console.warn("Type de message inconnu :", data.event_name);
        }
    } catch (error) {
        console.error("Erreur lors du traitement du message WebSocket :", error, event.data);
    }
}

function handleWebSocketOpen() {
    console.log("WebSocket connecté !");
}

function handleWebSocketClose() {
    console.log("WebSocket déconnecté !");
    stopLoadingBar();
    drawMessageOnCanvas("Déconnecté du jeu.");
}

function handleWebSocketError(event) {
    console.error("Erreur WebSocket :", event);
    alert("Erreur WebSocket. Vérifiez la configuration du serveur.");
}

// Gestion des différents types de messages
function handleMatchReady(data) {
    console.log("MATCH_READY: Le match est prêt à commencer !");
    drawMessageOnCanvas("Un joueur a rejoint. Le match va commencer !");
}

function handleAssignRole(data) {
    playerRole = data.player_role; // Stocke le rôle (player1 ou player2)
    console.log("Rôle assigné :", playerRole);
}

function handlePrintForUser(message) {
    console.log("PRINTFORUSER: Message reçu :", message);
    startLoadingBar();
}

function handleGameStart(state) {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Efface le canvas
    const { b_x, b_y, p1_pos, p2_pos, p1_score, p2_score } = state;

    console.log("GAME_START: Initialisation du jeu avec :", state);

    draw_ball(ctx, b_x, b_y, 10); // Dessiner la balle
    draw_paddle(ctx, 10, p1_pos); // Paddle gauche
    draw_paddle(ctx, canvas.width - 20, p2_pos); // Paddle droite
    draw_score(canvas, ctx, p1_score, p2_score); // Scores
}

function handleGameStateUpdate(state) {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Efface le canvas
    const { b_x, b_y, p1_pos, p2_pos, p1_score, p2_score } = state;

    draw_ball(ctx, b_x, b_y, 10);
    draw_paddle(ctx, 10, p1_pos); // Paddle gauche
    draw_paddle(ctx, canvas.width - 20, p2_pos); // Paddle droite
    draw_score(canvas, ctx, p1_score, p2_score);
}

// Envoi des directions du joueur via WebSocket
document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
        sendPlayerDirection(event.key === 'ArrowUp' ? -1 : 1);
        event.preventDefault();
    }
});

document.addEventListener('keyup', (event) => {
    if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
        sendPlayerDirection(0);
        event.preventDefault();
    }
});

function sendPlayerDirection(direction) {
    if (websocket && websocket.readyState === WebSocket.OPEN && playerRole !== null) {
        const message = { player_role: playerRole, direction: direction };
        websocket.send(JSON.stringify(message));
        console.log("Direction envoyée :", message);
    } else {
        console.warn("WebSocket non connectée ou rôle non assigné. Impossible d'envoyer la direction.");
    }
}


// Affiche un message sur le canvas
// Affiche un message sur le canvas
export function drawMessageOnCanvas(message) {
    const canvas = document.getElementById('pong-canvas');
    if (canvas) {
        const context = canvas.getContext('2d');
        context.clearRect(0, 0, canvas.width, canvas.height);
        
        // Utilisation de la police Press Start 2P
        context.font = '20px "Press Start 2P", Arial';
        context.fillStyle = 'white';
        context.textAlign = 'center';
        
        // Position du message légèrement au-dessus du centre pour laisser de l'espace en dessous
        context.fillText(message, canvas.width / 2, canvas.height / 2 - 20);
    } else {
        console.warn("Canvas introuvable !");
    }
}



