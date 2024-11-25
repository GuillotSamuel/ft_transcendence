import {stopLoadingBar, startLoadingBar} from './load_bar.js';
import {draw_ball, draw_paddle, draw_score} from './draw.js';
import {drawMessageOnCanvas} from "./draw.js";
import {ctx, canvas} from "./websocket.js";


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

function handleWinner(data) {
    let winner = data.winner;
    isGameOver = true; // Indique que le jeu est terminé
    console.log("le role du client est: ", playerRole);
    console.log("LE GAGNANT EST:", winner);
    console.log(`Le score est de p1: ${data.p1_score} et p2: ${data.p2_score}`);

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

    // Ajouter le bouton "Return" en dessous
    const buttonWidth = 200;
    const buttonHeight = 50;
    const buttonX = (canvas.width - buttonWidth) / 2;
    const buttonY = canvas.height / 2 + 100;

    // Dessiner le bouton
    ctx.fillStyle = 'gray';
    ctx.fillRect(buttonX, buttonY, buttonWidth, buttonHeight);

    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
    ctx.strokeRect(buttonX, buttonY, buttonWidth, buttonHeight);

    ctx.fillStyle = 'white';
    ctx.font = '16px "Press Start 2P", Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Return', buttonX + buttonWidth / 2, buttonY + buttonHeight / 2);

    // Ajouter l'écouteur d'événements pour le clic sur le bouton
    canvas.addEventListener('click', function onClick(event) {
        const rect = canvas.getBoundingClientRect();
        const clickX = event.clientX - rect.left;
        const clickY = event.clientY - rect.top;

        // Vérifier si le clic est sur le bouton "Return"
        if (
            clickX >= buttonX &&
            clickX <= buttonX + buttonWidth &&
            clickY >= buttonY &&
            clickY <= buttonY + buttonHeight
        ) {
            canvas.removeEventListener('click', onClick); // Supprimer l'écouteur après utilisation
            returnMain(); // Appeler la fonction pour retourner à l'écran principal
        }
    });
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
    if (isGameOver) {
        console.log("Le jeu est terminé. Les mises à jour sont ignorées.");
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
    console.log('Retour à l\'écran principal...');
    const ctx = document.getElementById('pong-canvas').getContext('2d');
    
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