import {stopLoadingBar, startLoadingBar} from './load_bar.js';
import {draw_ball, draw_paddle, draw_score} from './draw.js';
import {drawMessageOnCanvas} from "./draw.js"
import {ctx, canvas} from "./websocket.js"

export let playerRole = null; // Stocke le rôle du joueur

// Gestion des messages WebSocket
export function handleWebSocketMessage(event) {
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

export function handleWebSocketOpen() {
    console.log("WebSocket connecté !");
}

export function handleWebSocketClose() {
    console.log("WebSocket déconnecté !");
    stopLoadingBar();
    drawMessageOnCanvas("Déconnecté du jeu.");
}

export function handleWebSocketError(event) {
    console.error("Erreur WebSocket :", event);
    alert("Erreur WebSocket. Vérifiez la configuration du serveur.");
}

function handleMatchReady(data) {
    console.log("MATCH_READY: Le match est prêt à commencer !");
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
    stopLoadingBar();

    const { b_x, b_y, p1_pos, p2_pos, p1_score, p2_score } = state;

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