import { Ball } from "./ball.js";
import { Paddle } from "./paddle.js";
import { Score } from "./score.js";
import { resetLocal } from './gameManager.js';
import { createBoostPNG } from "./spicy_game/managePNG.js";

let canvas, ctx;
let gameRunning = false;

let ball, leftPaddle, rightPaddle, score, boost, begin_time;

let leftPaddleUp = false;
let leftPaddleDown = false;
let rightPaddleUp = false;
let rightPaddleDown = false;
let actionPerformed = false;
let currentRandomHeight = null;

function initializeGame() {

    begin_time = Date.now();
    // Sélection du canvas
    canvas = document.getElementById("pong-canvas");
    ctx = canvas.getContext("2d");
    canvas.width = 800;
    canvas.height = 600;

    // Initialisation des objets de jeu
    ball = new Ball(canvas.width / 2, canvas.height / 2, 10, 2, 2);
    leftPaddle = new Paddle(10, canvas.height / 2 - 50, 10, 100, canvas);
    rightPaddle = new Paddle(canvas.width - 20, canvas.height / 2 - 50, 10, 100, canvas);
    score = new Score(canvas, ctx);

    // Initialisation du champignon au centre
    boost = createBoostPNG("Skinny", canvas);

    // Écouteurs d'événements
    document.addEventListener("keydown", keyDownHandler);
    document.addEventListener("keyup", keyUpHandler);
}

function keyDownHandler(event) {
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

function keyUpHandler(event) {
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

export function startGame() {
    if (gameRunning) return;

    initializeGame();
    ball.resetPosition();
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
        ctx.font = "bold 60px 'Press Start 2P', cursive";
        ctx.textAlign = "center";
        ctx.fillText(winnerMessage, canvas.width / 2, canvas.height / 2);

        ctx.font = "bold 30px 'Press Start 2P', cursive";
        ctx.fillStyle = "#FFFFFF";
        ctx.fillText("Press 'Start' to play again", canvas.width / 2, canvas.height / 2 + 50);
    }

    if (score) score.resetScore();

    document.removeEventListener("keydown", keyDownHandler);
    document.removeEventListener("keyup", keyUpHandler);

    resetLocal();
}

function check_time() {
    let time_now = Date.now();
    let diff_time = (time_now - begin_time) / 1000;

    if (diff_time >= 8) {
        begin_time = time_now;
        actionPerformed = false;
        currentRandomHeight = null;
        return false;
    }

    if (diff_time >= 1) {
        return true; // time where you can draw 
    }

    return false;
}

function gameLoop() {
    if (!gameRunning) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ball.update(canvas, leftPaddle, rightPaddle);
    ball.draw(ctx);

    leftPaddle.move(leftPaddleUp, leftPaddleDown);
    rightPaddle.move(rightPaddleUp, rightPaddleDown);
    leftPaddle.draw(ctx);
    rightPaddle.draw(ctx);

    score.draw();

    // rand pos unique si diff time > 2
    if (check_time()) {
        if (!actionPerformed) {
            currentRandomHeight = boost.getRandomPosition(); // find unique pos with the height of canvas
            console.log("Random height generated:", currentRandomHeight);
            actionPerformed = true;
        }
        boost.draw(ctx, canvas.height, currentRandomHeight); 
    }

    if (ball.x - ball.radius <= 0) {
        score.incrementPlayer2();
        ball.resetPosition(1);
        begin_time = Date.now();
    }
    if (ball.x + ball.radius >= canvas.width) {
        score.incrementPlayer1();
        ball.resetPosition(2);
        begin_time = Date.now();
    }

    requestAnimationFrame(gameLoop);
}