import {draw_ball, draw_paddle, draw_score} from './draw.js';

let websocket = null; // Variable globale pour gérer la connexion WebSocket
let playerRole = null; // Stocke le rôle du joueur

let canvas, ctx;
//PRINTFORUSER

export async function startRemoteGame() {
    canvas = document.getElementById("pong-canvas");
    ctx = canvas.getContext("2d");
    
    try {
        const response = await fetch('api/manageMatch/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        });

        // Vérifiez si la réponse est un succès
        if (!response.ok) {
            const errorText = await response.text(); // Obtenez le texte brut de l'erreur
            console.error("Erreur serveur : ", errorText);
            alert("Erreur côté serveur lors de la création du match.");
            return; // Arrêtez la fonction
        }

        // Tentez d'analyser la réponse en JSON
        const data = await response.json();

        // Afficher le message si tout est correct
        drawMessageOnCanvas(data.message);

        // Initialisez la connexion WebSocket
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const websocketURL = `${protocol}//${window.location.host}/ws/game/`;
        websocket = new WebSocket(websocketURL);
    } catch (error) {
        // Gestion des erreurs réseau ou autres exceptions
        console.error("Erreur lors de l'appel à l'API : ", error);
        alert("Impossible de se connecter au serveur. Vérifiez votre connexion réseau.");
    }

    websocket.onmessage = handleWebSocketMessage;
    websocket.onopen = handleWebSocketOpen;
    websocket.onclose = handleWebSocketClose;
    websocket.onerror = handleWebSocketError;

}




function handleWebSocketMessage(event) {
    try {
        const data = JSON.parse(event.data);
        //console.log("Message reçu via WebSocket :", data);

        if (!data.event_name) {
            console.warn("Message mal formé reçu :", data);
            return;
        }

        switch (data.event_name) {
            case 'ASSIGN_ROLE':
                console.log("ASSIGN ROLE: ")
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

            default:
                console.warn("Type de message inconnu :", data.event_name);
        }
    } catch (error) {
        console.error("Erreur lors du traitement du message WebSocket :", error, event.data);
    }
}

function handleMatchReady(data) {
    console.log("MATCH_READY: Le match est prêt à commencer !");
    drawMessageOnCanvas("Un joueur a rejoint. Le match va commencer !");
    // Vous pouvez lancer des actions supplémentaires ici si nécessaire
}

function handleAssignRole(data) {
    playerRole = data.player_role; // Stocker le rôle (player1 ou player2)
    console.log("Rôle assigné :", playerRole);

    // Afficher un message sur le canvas
    drawMessageOnCanvas(`Vous êtes ${playerRole === 1 ? 'Joueur 1' : 'Joueur 2'}`);
}


function handlePrintForUser(message) {
    console.log("PRINTFORUSER: Message reçu :", message);
    drawMessageOnCanvas(message);
}


function handleGameStart(state) {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Efface le canvas

    const { b_x, b_y, p1_pos, p2_pos, p1_score, p2_score } = state;

    console.log("GAME_START: Initialisation du jeu avec :", state);

    // Dessiner la balle
    draw_ball(ctx, b_x, b_y, 10);

    // Dessiner les paddles
    draw_paddle(ctx, 10, p1_pos); // Paddle gauche
    draw_paddle(ctx, canvas.width - 20, p2_pos); // Paddle droite

    // Dessiner les scores
    draw_score(canvas, ctx, p1_score, p2_score);
}


function handleGameStateUpdate(state) {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Efface le canvas

    const { b_x, b_y, p1_pos, p2_pos, p1_score, p2_score } = state;

    //console.log("Game state update: ", state);

    // Dessiner la balle
    draw_ball(ctx, b_x, b_y, 10);

    // Dessiner les paddles
    draw_paddle(ctx, 10, p1_pos); // Paddle gauche
    draw_paddle(ctx, canvas.width - 20, p2_pos); // Paddle droite

    // Mettre à jour les scores
    draw_score(canvas, ctx, p1_score, p2_score);
}


// function handleWebSocketClose(event) {
//     console.log("WebSocket déconnecté :", event.code, event.reason);
//     drawMessageOnCanvas("Déconnecté du jeu.");
// }

// function handleWebSocketError(event) {
//     console.error("Erreur WebSocket :", event);
//     alert("Erreur WebSocket. Vérifiez la configuration du serveur.");
// }

document.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'ArrowUp':
            sendPlayerDirection(-1); // Envoie la direction "haut"
            event.preventDefault(); // Empêche le comportement par défaut
            console.log("Touche press :", 'ArrowUp');
            break;
        case 'ArrowDown':
            sendPlayerDirection(1); // Envoie la direction "bas"
            event.preventDefault(); // Empêche le comportement par défaut
            console.log("Touche press :", 'ArrowDown');
            break;
    }
});

// Gestion des touches relâchées
document.addEventListener('keyup', (event) => {
    if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
        sendPlayerDirection(0); // Envoie la direction "arrêt"
        event.preventDefault(); // Empêche le comportement par défaut
    }
});

function sendPlayerDirection(direction) {
    if (websocket && websocket.readyState === WebSocket.OPEN && playerRole !== null) {
        const message = {
            player_role: playerRole,
            direction: direction
        };
        websocket.send(JSON.stringify(message));
        console.log("Direction envoyée :", message);
    } else {
        console.warn("WebSocket non connectée ou rôle non assigné. Impossible d'envoyer la direction.");
    }
}



export function drawMessageOnCanvas(message) {
    const canvas = document.getElementById('pong-canvas');
    if (canvas) {
        const context = canvas.getContext('2d');
        context.clearRect(0, 0, canvas.width, canvas.height); // Efface le canvas
        context.font = '30px Arial';
        context.fillStyle = 'white';
        context.textAlign = 'center';
        context.fillText(message, canvas.width / 2, canvas.height / 2);
    } else {
        console.warn("Canvas introuvable !");
    }
}

function handleWebSocketOpen() {
    console.log("WebSocket connecté !");
}

function handleWebSocketClose(event) {
    console.log("WebSocket déconnecté :", event.code, event.reason);
    drawMessageOnCanvas("Déconnecté du jeu.");
}

function handleWebSocketError(event) {
    console.error("Erreur WebSocket :", event);
    alert("Erreur WebSocket. Vérifiez la configuration du serveur.");
}
