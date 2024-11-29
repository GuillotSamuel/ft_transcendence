import { Ball } from "./ball.js";
import { Paddle } from "./paddle.js";
import { Score } from "./score.js";
import { resetLocal, startListeningForPageChanges, stopListeningForPageChanges } from './gameManager.js';
import { createBoostPNG } from "./spicy_game/managePNG.js";
import {displaySecondaryButtons} from "../app.js";

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

function initializeGame()
{
    startListeningForPageChanges();
    begin_time = Date.now();
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

    // Initialisation du champignon au centre
    imageBoost = createBoostPNG("Skinny", canvas);

    // Écouteurs d'événements
    document.addEventListener("keydown", keyDownHandler);
    document.addEventListener("keyup", keyUpHandler);
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

export function startGame()
{
    if (gameRunning) return;

    initializeGame();
    gameRunning = true;
    gameLoop();
}

export function stopGame() {
    gameRunning = false;
    if (!ctx || !canvas) {
        console.warn("Canvas or context not initialized. Skipping cleanup.");
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let winnerMessage = '';
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
        ctx.fillText("Press 'Start' to play again", canvas.width / 2, canvas.height / 2 + 60);
    }

    if (score) 
        score.resetScore();

    document.removeEventListener("keydown", keyDownHandler);
    document.removeEventListener("keyup", keyUpHandler);
    stopListeningForPageChanges();
    resetLocal();

    displaySecondaryButtons();
}



function gameLoop()
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

    score.draw();

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
            console.log("Random height generated:", currentRandomY);
            console.log("Boost Type:", currentBoostType);
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
    requestAnimationFrame(gameLoop);
}

function check_time() 
{
    const time_now = Date.now();
    let diff_time = (time_now - begin_time) / 1000; // convert in sec

    if (diff_time >= 8) {
        begin_time = time_now;
        actionPerformed = false;
        currentRandomY = null;
        imageBoost = null;
        return false;
    }

    if (diff_time >= 3) {
        return true; // time where you can draw 
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

