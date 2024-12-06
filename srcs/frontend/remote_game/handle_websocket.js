import {stopLoadingBar, startLoadingBar} from './load_bar.js';
import {draw_ball, draw_paddle, draw_score} from './draw.js';
import {drawMessageOnCanvas, createButton} from "./draw.js";
import {ctx, canvas, websocket, setIsRemoteGameActive, getIsRemoteGameActive,  handleRemoteKeyDown, handleRemoteKeyUp} from "./websocket.js";
import {stopListening} from "./disconnect.js";

export let playerRole = null; // Stocke le rôle du joueur
export let isGameOver = false; // Variable globale

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
            
            case 'WINNER_UPDATE':
                handleWinner(data.data);
                break;

            case 'GAME_STATE_UPDATE':
                handleGameStateUpdate(data.data);
                break;

            case 'GAME_START':
                handleGameStart(data.data);
                break;

            case 'GAME_STOPPED':
                handleGameStopped(data.data)
                break;

            case 'PLAYER_DISCONNECTED':
                drawMessageOnCanvas(`Le joueur ${data.data.player_number} s'est déconnecté.`);
                break;

            default:
                console.warn("Type de message inconnu :", data.event_name);
        }
    } catch (error) {
        console.error("Erreur lors du traitement du message WebSocket :", error, event.data);
    }
}


export function handleGameStopped(){

    isGameOver = true; // Indique que le jeu est terminé

    if (getIsRemoteGameActive())
        setIsRemoteGameActive(false);
    // Efface le canvas et affiche le message du gagnant
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Effacer l'écran

    // Définir la couleur du message
    let messageColor = "green";

    // Affiche un message pour le gagnant
    
    drawMessageOnCanvas(`Your Opponent has been disconnected`, messageColor);

    // Affiche les scores finaux au centre de l'écran
    ctx.font = "20px 'Press Start 2P', Arial";
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.fillText(
        `You Won 3 - 0`,
        canvas.width / 2,
        canvas.height / 2 + 40
    );
    const disconnectButton = document.getElementById('disconnect-button');

    disconnectButton.style.display = 'none';

    // Crée le bouton "Return" avec gestion des clics
    createButton(ctx, 'Return', canvas.width / 2 - 100, canvas.height / 2 + 100, 200, 50, returnMain, canvas);
}

export function handleWebSocketOpen() {
}

export function handleWebSocketClose() {
    stopLoadingBar();

    playerRole = null;
    isGameOver = false;
}

export function handleWebSocketError(event) {
    console.error("Erreur WebSocket :", event);
    alert("Erreur WebSocket. Vérifiez la configuration du serveur.");
}

function handleMatchReady(data) {
    stopListening();
}

function handleWinner(data) {
    let winner = data.winner;
    isGameOver = true; // Indique que le jeu est terminé

    if (getIsRemoteGameActive())
        setIsRemoteGameActive(false);
    // Efface le canvas et affiche le message du gagnant
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Effacer l'écran

    // Définir la couleur du message
    let messageColor = (winner === "player1" && playerRole == 1) || (winner === "player2" && playerRole == 2) ? "green" : "red";

    // Affiche un message pour le gagnant
    if (winner === "player1" && playerRole == 1) {
        drawMessageOnCanvas(`W = 1 You Win`, messageColor);
    } else if (winner === "player1" && playerRole == 2) {
        drawMessageOnCanvas(`W = 1 You Loose`, messageColor);
    } else if (winner === "player2" && playerRole == 2) {
        drawMessageOnCanvas(`W = 2 You Win`, messageColor);
    } else {
        drawMessageOnCanvas(`W = 2 You Loose`, messageColor);
    }

    // Affiche les scores finaux au centre de l'écran
    ctx.font = "20px 'Press Start 2P', Arial";
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.fillText(
        `Score final : P1: ${data.p1_score} - P2: ${data.p2_score}`,
        canvas.width / 2,
        canvas.height / 2 + 40
    );
    const disconnectButton = document.getElementById('disconnect-button');

    disconnectButton.style.display = 'none';

    // Crée le bouton "Return" avec gestion des clics
    createButton(ctx, 'Return', canvas.width / 2 - 100, canvas.height / 2 + 100, 200, 50, returnMain, canvas);
}

function handleAssignRole(data) {
    playerRole = data.player_role; // Stocke le rôle (player1 ou player2)
}

function handlePrintForUser(message) {
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
    if (isGameOver) {
        return; // Arrête de traiter les mises à jour si le jeu est terminé
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height); // Efface le canvas
    const { b_x, b_y, p1_pos, p2_pos, p1_score, p2_score } = state;

    // Dessine les éléments du jeu
    draw_ball(ctx, b_x, b_y, 10);          // Dessiner la balle
    draw_paddle(ctx, 10, p1_pos);          // Dessiner le paddle gauche
    draw_paddle(ctx, canvas.width - 20, p2_pos); // Dessiner le paddle droit
    draw_score(canvas, ctx, p1_score, p2_score); // Dessiner les scores
}

function returnMain() {
    const ctx = document.getElementById('pong-canvas').getContext('2d');
    
    if (websocket && websocket.readyState === WebSocket.OPEN) {
        websocket.close(); // Fermeture de la connexion
    }

    // Supprimer les événements clavier pour ce jeu
    document.removeEventListener('keydown', handleRemoteKeyDown);
    document.removeEventListener('keyup', handleRemoteKeyUp);

    // Effacer le canvas
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    
    // Réafficher les boutons principaux ou réinitialiser le canvas selon votre logique
    const localButton = document.getElementById('local-button');
    const remoteButton = document.getElementById('remote-button');
    const disconnectButton = document.getElementById('disconnect-button');

    disconnectButton.style.display = 'none';
    localButton.style.display = 'block';
    remoteButton.style.display = 'block';
}