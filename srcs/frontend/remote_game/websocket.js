let websocket = null; // Variable globale pour gérer la connexion WebSocket


//PRINTFORUSER

export async function startRemoteGame() {
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
    // websocket.onclose = handleWebSocketClose;
    // websocket.onerror = handleWebSocketError;
}


// function handleWebSocketOpen(roomName) {
//     console.log("WebSocket connecté !");
//     drawMessageOnCanvas("Connexion à la salle...");

//     // Envoyer un message pour rejoindre une salle
//     sendWebSocketMessage({
//         room_name: roomName,
//         message: "Connexion au jeu"
//     });
// }

function handleWebSocketMessage(event) {
    try {
        const data = JSON.parse(event.data);
        console.log("Message reçu via WebSocket :", data);

        if (!data.event_name) {
            console.warn("Message mal formé reçu :", data);
            return;
        }

        switch (data.event_name) {
            case 'PRINTFORUSER':
                console.log("PRINTFORUSER: Message reçu :", data.data);
                drawMessageOnCanvas(data.data);
                break;
            case 'GAME_STATE_UPDATE':
                console.log("Game state update: Message reçu :", data.data);
                break;
            case 'GAME_START':
                console.log("GAME_START: Message reçu :", data.data);
                break;
            default:
                console.warn("Type de message inconnu :", data.event_name);
        }
    } catch (error) {
        console.error("Erreur lors du traitement du message WebSocket :", error, event.data);
    }
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
            sendPlayerDirection(1); // Envoie la direction "haut"
            event.preventDefault(); // Empêche le comportement par défaut
            break;
        case 'ArrowDown':
            sendPlayerDirection(-1); // Envoie la direction "bas"
            event.preventDefault(); // Empêche le comportement par défaut
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
    if (websocket && websocket.readyState === WebSocket.OPEN) {
        const message = {
            direction: direction // Respecte la structure attendue par le backend
        };
        websocket.send(JSON.stringify(message)); // Envoie les données au serveur
        console.log("Direction envoyée :", message);
    } else {
        console.warn("WebSocket non connectée. Impossible d'envoyer la direction.");
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