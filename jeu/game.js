import { Ball } from "./ball.js";
import { Paddle } from "./paddle.js";
import { Score } from "./score.js";

const canvas = document.getElementById("pong-canvas");
const ctx = canvas.getContext("2d");
canvas.width = 600;
canvas.height = 400;

const playOverlay = document.getElementById("play-overlay");
const playButton = document.getElementById("play-button");

let gameRunning = false; // Variable to track game state

// Initialize the ball, paddles, and score
const ball = new Ball(canvas.width / 2, canvas.height / 2, 10, 2, 2);
const leftPaddle = new Paddle(10, canvas.height / 2 - 50, 10, 100, canvas);
const rightPaddle = new Paddle(canvas.width - 20, canvas.height / 2 - 50, 10, 100, canvas);
const score = new Score(canvas, ctx);

// Control variables for paddles
let leftPaddleUp = false;
let leftPaddleDown = false;
let rightPaddleUp = false;
let rightPaddleDown = false;

// Event listeners for paddle control
document.addEventListener("keydown", (event) => {
    if (event.key === "w") leftPaddleUp = true;
    if (event.key === "s") leftPaddleDown = true;
    if (event.key === "ArrowUp") rightPaddleUp = true;
    if (event.key === "ArrowDown") rightPaddleDown = true;
    if (event.key === "Escape") stopGame(); // Stop the game if Escape is pressed
});

document.addEventListener("keyup", (event) => {
    if (event.key === "w") leftPaddleUp = false;
    if (event.key === "s") leftPaddleDown = false;
    if (event.key === "ArrowUp") rightPaddleUp = false;
    if (event.key === "ArrowDown") rightPaddleDown = false;
});

// Function to start the game
function startGame() {
    playOverlay.style.display = "none";
    canvas.style.display = "block";
    gameRunning = true;
    gameLoop();
}

// Function to stop the game and show the Play button
function stopGame() {
    gameRunning = false; // Stop the game loop
    playOverlay.style.display = "flex"; // Show the overlay
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
    canvas.style.display = "none";
    score.resetScore();
}

// Game loop function
function gameLoop() {
    if (!gameRunning) return; // Exit if game is not running

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update and draw the ball
    ball.update(canvas, leftPaddle, rightPaddle);
    ball.draw(ctx);

    // Update and draw paddles
    leftPaddle.move(leftPaddleUp, leftPaddleDown);
    rightPaddle.move(rightPaddleUp, rightPaddleDown);
    leftPaddle.draw(ctx);
    rightPaddle.draw(ctx);

    // Update score logic
    if (ball.x - ball.radius <= 0) {
        score.incrementPlayer2();
        ball.resetPosition(1);
    }
    if (ball.x + ball.radius > canvas.width) {
        score.incrementPlayer1();
        ball.resetPosition(2);
    }

    // Draw the score
    score.draw();

    requestAnimationFrame(gameLoop);
}

// Event listener for Play button to start the game
playButton.addEventListener("click", startGame);