let websocket = null; // Variable globale pour gérer la connexion WebSocket

export function startRemoteGame(roomName = "match1") {
    // Détermine le protocole WebSocket (wss ou ws)
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const websocketURL = `${protocol}//${window.location.host}/ws/game/`;

    // Initialiser la connexion WebSocket
    websocket = new WebSocket(websocketURL);

    // Gérer les événements de la WebSocket
    websocket.onopen = () => handleWebSocketOpen(roomName);
    websocket.onmessage = handleWebSocketMessage;
    websocket.onclose = handleWebSocketClose;
    websocket.onerror = handleWebSocketError;
}

function handleWebSocketOpen(roomName) {
    console.log("WebSocket connecté !");
    drawMessageOnCanvas("Connexion à la salle...");

    // Envoyer un message pour rejoindre une salle
    sendWebSocketMessage({
        room_name: roomName,
        message: "Connexion au jeu"
    });
}

function handleWebSocketMessage(event) {
    const data = JSON.parse(event.data);

    switch (data.type) {
        case 'joined':
            console.log("Message reçu :", data.message);
            drawMessageOnCanvas(data.message);
            break;
        case 'game_started':
            console.log("Partie lancée :", data.message);
            drawMessageOnCanvas("Partie lancée !");
            break;
        case 'message':
            console.log("Message reçu :", data.message);
            break;
        default:
            console.warn("Type de message inconnu :", data.type);
    }
}

function handleWebSocketClose(event) {
    console.log("WebSocket déconnecté :", event.code, event.reason);
    drawMessageOnCanvas("Déconnecté du jeu.");
}

function handleWebSocketError(event) {
    console.error("Erreur WebSocket :", event);
    alert("Erreur WebSocket. Vérifiez la configuration du serveur.");
}

function sendWebSocketMessage(data) {
    if (websocket && websocket.readyState === WebSocket.OPEN) {
        websocket.send(JSON.stringify(data));
    } else {
        console.warn("WebSocket non connectée ou indisponible.");
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