// game.js

import { Ball } from "./ball.js";
import { Paddle } from "./paddle.js";
import { Score } from "./score.js";

let canvas, ctx;
let gameRunning = false;

let ball, leftPaddle, rightPaddle, score;

let leftPaddleUp = false;
let leftPaddleDown = false;
let rightPaddleUp = false;
let rightPaddleDown = false;

function initializeGame() {
    // Select the canvas after it's rendered in the DOM
    canvas = document.getElementById("pong-canvas");
    ctx = canvas.getContext("2d");
    canvas.width = 800;
    canvas.height = 600;

    // Initialize game objects
    ball = new Ball(canvas.width / 2, canvas.height / 2, 10, 2, 2);
    leftPaddle = new Paddle(10, canvas.height / 2 - 50, 10, 100, canvas);
    rightPaddle = new Paddle(canvas.width - 20, canvas.height / 2 - 50, 10, 100, canvas);
    score = new Score(canvas, ctx);

    // Add event listeners
    document.addEventListener("keydown", keyDownHandler);
    document.addEventListener("keyup", keyUpHandler);
}

function keyDownHandler(event) {
    if (event.key === "w") leftPaddleUp = true;
    if (event.key === "s") leftPaddleDown = true;
    if (event.key === "ArrowUp") {
        rightPaddleUp = true;
        event.preventDefault(); // Prevent default scrolling
    }
    if (event.key === "ArrowDown") {
        rightPaddleDown = true;
        event.preventDefault(); // Prevent default scrolling
    }
    if (event.key === "Escape") stopGame();
}

function keyUpHandler(event) {
    if (event.key === "w") leftPaddleUp = false;
    if (event.key === "s") leftPaddleDown = false;
    if (event.key === "ArrowUp") {
        rightPaddleUp = false;
        event.preventDefault(); // Prevent default scrolling
    }
    if (event.key === "ArrowDown") {
        rightPaddleDown = false;
        event.preventDefault(); // Prevent default scrolling
    }
}

export function startGame() {
    initializeGame();
    gameRunning = true;
    gameLoop();
}

function stopGame() {
    gameRunning = false;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Determine who won and set message color
    let winnerMessage = '';
    if (score.scorePlayer1 > score.scorePlayer2) {
        winnerMessage = 'Player 1 Wins!';
        ctx.fillStyle = "#FF4136"; // Red for Player 2
    } else if (score.scorePlayer2 > score.scorePlayer1) {
        winnerMessage = 'Player 2 Wins!';
        ctx.fillStyle = "#0074D9"; // Blue for Player 1
    } else {
        winnerMessage = 'It\'s a Draw!';
        ctx.fillStyle = "#FFFFFF"; // White for a draw
    }

    // Display the winner message
    ctx.font = "bold 60px 'Press Start 2P', cursive";
    ctx.textAlign = "center";
    ctx.fillText(winnerMessage, canvas.width / 2, canvas.height / 2);

    // Display instructions to restart the game
    ctx.font = "bold 30px 'Press Start 2P', cursive";
    ctx.fillStyle = "#FFFFFF"; // White for instructions
    ctx.fillText("Press 'Start' to play again", canvas.width / 2, canvas.height / 2 + 50);

    // Reset the score for the next game
    score.resetScore();

    // Remove event listeners to prevent further input
    document.removeEventListener("keydown", keyDownHandler);
    document.removeEventListener("keyup", keyUpHandler);
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
    
    if (ball.x - ball.radius <= 0) {
        score.incrementPlayer2();
        ball.resetPosition(1);
    }
    if (ball.x + ball.radius >= canvas.width) {
        score.incrementPlayer1();
        ball.resetPosition(2);
    }

    
    requestAnimationFrame(gameLoop);
}
