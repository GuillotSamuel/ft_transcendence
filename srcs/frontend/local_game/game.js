import { Ball } from "./ball.js";
import { Paddle } from "./paddle.js";
import { Score } from "./score.js";
import { resetLocal, startListeningForPageChanges, stopListeningForPageChanges } from './gameManager.js';
import { createBoostPNG } from "./spicy_game/managePNG.js";

let canvas, ctx;
let gameRunning = false;
let currentBoostType = "Skinny";
let ball, leftPaddle, rightPaddle, score, imageBoost, begin_time;
let leftPaddleUp = false;
let leftPaddleDown = false;
let rightPaddleUp = false;
let rightPaddleDown = false;
let actionPerformed = false;
let currentRandomY = null;
let countdownInterval = null;
let tournament = false;
let player1 = "Player1";
let player2 = "Player2";
let winner;

window.clearCanvas = clearCanvas;

function initializeGame()
{
    startListeningForPageChanges();
    begin_time = Date.now();
    winner = "None";
    // Sélection du canvas
    canvas = document.getElementById("pong-canvas");
    ctx = canvas.getContext("2d");
    canvas.width = 600;
    canvas.height = 400;
    
    // Initialisation des objets de jeu
    ball = new Ball(canvas.width / 2, canvas.height / 2, 10, 2, 2);
    leftPaddle = new Paddle(10, canvas.height / 2 - 50, 10, 80, canvas);
    rightPaddle = new Paddle(canvas.width - 20, canvas.height / 2 - 50, 10, 80, canvas);
    score = new Score(canvas, ctx);

    leftPaddle.draw(ctx);
    rightPaddle.draw(ctx);
    ball.draw(ctx);
    score.drawWithNames(player1, player2);
    // Initialisation du champignon au centre
    imageBoost = createBoostPNG("Skinny", canvas);

    // Écouteurs d'événements
    document.addEventListener("keydown", keyDownHandler);
    document.addEventListener("keyup", keyUpHandler);
}

export function startGame(type, p1, p2) {
    return new Promise((resolve) => {
        if (gameRunning) return;
        if (type == "tour") tournament = true;
        player1 = p1;
        player2 = p2;
        initializeGame();
        gameRunning = true;

        countdown(() => {
            if (type == "local") {
                gameLoop(); // Passez resolve pour capturer le gagnant
            } else if (type == "custom") {
                gameLoopCustom();
            } else {
                gameLoop(resolve);
            }
        });
    });
}

export function stopGame(resolve) {
    gameRunning = false;

    document.removeEventListener("keydown", keyDownHandler);
    document.removeEventListener("keyup", keyUpHandler);
    stopListeningForPageChanges();
    resetLocal();
    
    // Arrêter le compte à rebours s'il est actif
    if (countdownInterval) {
        clearInterval(countdownInterval);
        countdownInterval = null;
    }

    if (!ctx || !canvas) {
        console.warn("Canvas or context not initialized. Skipping cleanup.");
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (tournament) {
        tournament = false;
        winner = displayWinnerTour(ctx, canvas, player1, player2, score);
        resolve(winner);
        return;
    }

    let winnerMessage = '';player1
    if (score.scorePlayer1 > score.scorePlayer2) {
        winnerMessage = 'Player 1 Wins!';
        ctx.fillStyle = "#FF4136";
    } else if (score.scorePlayer2 > score.scorePlayer1) {
        winnerMessage = 'Player 2 Wins!';
        ctx.fillStyle = "#0074D9";
    } else {
        winnerMessage = 'It\'s a Draw!';
        ctx.fillStyle = "#FFFFFF";
    }

    if (ctx) {
        // Afficher le message de victoire
        ctx.font = "20px 'Press Start 2P', Arial";
        ctx.textAlign = "center";
        ctx.fillText(winnerMessage, canvas.width / 2, canvas.height / 2);

        // Afficher le score final
        ctx.font = "16px 'Press Start 2P', Arial";
        ctx.fillStyle = "#FFFFFF";
        const finalScore = `Final Score: ${score.scorePlayer1} - ${score.scorePlayer2}`;
        ctx.fillText(finalScore, canvas.width / 2, canvas.height / 2 + 30);

        // Afficher l'invitation à rejouer
        ctx.font = "16px 'Press Start 2P', Arial";
        ctx.fillText("Press 'Return' to play again", canvas.width / 2, canvas.height / 2 + 60);
    }

    if (score) 
        score.resetScore();
    
    const gameButtonDisplay = document.getElementById('gameButtonDisplay');

    // Remplace tout le contenu par uniquement le bouton de retour
    gameButtonDisplay.innerHTML = `
        <button class="btn btn-secondary btn-lg" onclick="clearCanvas(); displaySecondaryButtons()">Return</button>
    `;
}

export function clearCanvas() {
    if (ctx && canvas) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
}

function gameLoop(resolve) {
    if (!gameRunning) return;
    if (score.check_winner() == true) {
        stopGame(resolve); // Appelle stopGame avec resolve
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ball.update(canvas, leftPaddle, rightPaddle);
    ball.draw(ctx);

    leftPaddle.move(leftPaddleUp, leftPaddleDown);
    rightPaddle.move(rightPaddleUp, rightPaddleDown);

    leftPaddle.draw(ctx);
    rightPaddle.draw(ctx);

    score.drawWithNames(player1, player2);

    if (ball.x - ball.radius <= 0) {
        score.incrementPlayer(2);
        ball.resetPosition(1);
    } else if (ball.x + ball.radius >= canvas.width) {
        score.incrementPlayer(1);
        ball.resetPosition(2);
    }

    // Utilisation d'une fonction fléchée pour passer `resolve` à la prochaine itération
    if (tournament)
        requestAnimationFrame(() => gameLoop(resolve));
    else{
        requestAnimationFrame(gameLoop);
    }
}


function gameLoopCustom()
{
    if (!gameRunning) return;
    if (score.check_winner() == true)
    {
        stopGame();
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ball.update(canvas, leftPaddle, rightPaddle);
    ball.draw(ctx);
    
    check_ball_and_bonus(ball, imageBoost);
    
    leftPaddle.move(leftPaddleUp, leftPaddleDown);
    rightPaddle.move(rightPaddleUp, rightPaddleDown);


    leftPaddle.draw(ctx);
    rightPaddle.draw(ctx);

    score.drawWithNames();
    //rand pos unique si diff time > 2
    if (check_time()) {
        if (!actionPerformed) {
            const randomValue = Math.random();
            
            // Déterminer le type de boost en fonction de randomValue
            if (randomValue < 0.33) {
                currentBoostType = "Fat";
            } else if (randomValue < 0.66) {
                currentBoostType = "Skinny";
            } else {
                currentBoostType = "Arrow"; // Nouvelle possibilité
            }

            imageBoost = createBoostPNG(currentBoostType, canvas); // Crée un boost basé sur le type choisi
            currentRandomY = imageBoost.getRandomPosition(); // Trouve une position unique sur la hauteur du canvas
            actionPerformed = true;
        }
        imageBoost.draw(ctx, canvas.height, currentRandomY);
    }

    if (ball.x - ball.radius <= 0) {
        score.incrementPlayer(2);
        ball.resetPosition(1);
        reset_all();
    }
    else if (ball.x + ball.radius >= canvas.width) {
        score.incrementPlayer(1);
        ball.resetPosition(2);
        reset_all();
    }
    requestAnimationFrame(gameLoopCustom);
}

function check_time() {
    const time_now = Date.now();
    let diff_time = (time_now - begin_time) / 1000; // Convertir en secondes

    if (diff_time >= 8) {
        begin_time = time_now;
        actionPerformed = false;
        currentRandomY = null;
        imageBoost = null;
        return false;
    }

    if (diff_time >= 3) {
        return true; // Condition satisfaite
    }
    return false;
}


function check_ball_and_bonus(ball, imageBoost)
{
    if (imageBoost){
        let y = imageBoost.drawY;
        let x = imageBoost.drawX;
        let hauteur = imageBoost.drawY + imageBoost.height;
        let largeur = imageBoost.drawX + imageBoost.width;

        let xball = ball.x + ball.radius; 
        let yball = ball.y + ball.radius;
        if ((xball >= x && xball <= largeur) && (yball >= y && yball <= hauteur)) {
            handle_bonus();
        }
    }

}

function handle_bonus() 
{
    const duration = 5000; // Durée du bonus en millisecondes

    if (ball.getLastPaddleTouch() === "right") {
        if (currentBoostType === "Skinny") {
            leftPaddle.applyBonus(60, "red", duration);
        } 
        else if (currentBoostType === "Fat"){
            rightPaddle.applyBonus(110, "#00FF00", duration);
        }
        else{
            leftPaddle.reverse("yellow", duration);
        }
    } else if (ball.getLastPaddleTouch() === "left") {
        if (currentBoostType === "Skinny") {
            rightPaddle.applyBonus(60, "red", duration);
        } 
        else if (currentBoostType === "Fat"){
            leftPaddle.applyBonus(110, "#00FF00", duration);
        }
        else{
            rightPaddle.reverse("yellow", duration);
        }
    }
}

function reset_all()
{
    rightPaddle.resetBonus();
    leftPaddle.resetBonus();

    imageBoost = null;
    actionPerformed = false;
    begin_time = Date.now();
}

function countdown(callback) {
    let countdownTime = 3; // Début du compte à rebours
    countdownInterval = setInterval(() => { // Stocke l'identifiant
        // Effacer le canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        leftPaddle.draw(ctx);
        rightPaddle.draw(ctx);
        ball.draw(ctx);
        score.drawWithNames(player1, player2);
        
        // Afficher le message principal
        ctx.font = "30px 'Press Start 2P', Arial";
        ctx.textAlign = "center";
        ctx.fillStyle = "#FFFFFF";
        ctx.fillText("The game is starting...", canvas.width / 2, canvas.height / 2 - 50);

        // Afficher le compte à rebours
        ctx.font = "30px 'Press Start 2P', Arial";
        ctx.fillText(countdownTime, canvas.width / 2, canvas.height / 2 + 50);

        countdownTime--;

        if (countdownTime < 0) {
            clearInterval(countdownInterval); // Arrêter l'intervalle
            countdownInterval = null; // Réinitialiser la variable
            ctx.clearRect(0, 0, canvas.width, canvas.height); // Effacer le canvas
            callback(); // Démarrer le jeu une fois le compte à rebours terminé
        }
    }, 1000); // 1 seconde entre chaque étape
}

function keyDownHandler(event)
{
    if (event.key === "w") leftPaddleUp = true;
    if (event.key === "s") leftPaddleDown = true;
    if (event.key === "ArrowUp") {
        rightPaddleUp = true;
        event.preventDefault();
    }
    if (event.key === "ArrowDown") {
        rightPaddleDown = true;
        event.preventDefault();
    }
    if (!tournament)
        if (event.key === "Escape") stopGame();
}

function keyUpHandler(event)
{
    if (event.key === "w") leftPaddleUp = false;
    if (event.key === "s") leftPaddleDown = false;
    if (event.key === "ArrowUp") {
        rightPaddleUp = false;
        event.preventDefault();
    }
    if (event.key === "ArrowDown") {
        rightPaddleDown = false;
        event.preventDefault();
    }
}


function displayWinnerTour(ctx, canvas, player1, player2, score) {
    let winner;
    let message = '';

    if (score.scorePlayer1 > score.scorePlayer2) {
        winner = player1;
        message = `${player1} Wins!`;
    } else {
        winner = player2;
        message = `${player2} Wins!`;
    }

    if (ctx) {
        // Afficher le message de victoire
        ctx.font = "20px 'Press Start 2P', Arial";
        ctx.textAlign = "center";
        ctx.fillStyle = "#FFFFFF"; // Couleur blanche pour le texte
        ctx.fillText(message, canvas.width / 2, canvas.height / 2);

        // Afficher le score final
        ctx.font = "16px 'Press Start 2P', Arial";
        const finalScore = `Final Score: ${player1} ${score.scorePlayer1} - ${score.scorePlayer2} ${player2}`;
        ctx.fillText(finalScore, canvas.width / 2, canvas.height / 2 + 30);
    }

    return winner;
}