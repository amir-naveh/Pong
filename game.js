let canvas = document.getElementById("pong");
let context = canvas.getContext("2d");

let upArrowPressed = false;
let downArrowPressed = false;
let gamePaused = false;  // Added gamePaused variable
let gameActive = false;
let backgroundImg = document.getElementById("background");


let ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 10,
    dx: 2,
    dy: 2
};

let playerPaddle = {
    x: 0,
    y: canvas.height / 2 - 50,
    width: 10,
    height: 100,
    dy: 2
};

let aiPaddle = {
    x: canvas.width - 10,
    y: canvas.height / 2 - 50,
    width: 10,
    height: 100,
    dy: 2
};

let playerScore = 0;
let aiScore = 0;


context.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);

// event listeners to move the player paddle
window.addEventListener("keydown", function(event) {
    switch (event.keyCode) {
        case 38: // up arrow key
            upArrowPressed = true;
            break;
        case 40: // down arrow key
            downArrowPressed = true;
            break;
    }
}, false);

window.addEventListener("keyup", function(event) {
    switch (event.keyCode) {
        case 38: // up arrow key
            upArrowPressed = false;
            break;
        case 40: // down arrow key
            downArrowPressed = false;
            break;
    }
}, false);


function drawRect(x, y, w, h, color) {
    context.fillStyle = color;
    context.fillRect(x, y, w, h);
}

function drawCircle(x, y, r, color) {
    context.fillStyle = color;
    context.beginPath();
    context.arc(x, y, r, 0, Math.PI * 2, false);
    context.closePath();
    context.fill();
}

function drawText(text, x, y, color) {
    context.fillStyle = color;
    context.font = "50px 'Montserrat', sans-serif";
    context.fillText(text, x, y);
}

function update() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);

    drawRect(playerPaddle.x, playerPaddle.y, playerPaddle.width, playerPaddle.height, "white");
    drawRect(aiPaddle.x, aiPaddle.y, aiPaddle.width, aiPaddle.height, "white");
    drawCircle(ball.x, ball.y, ball.radius, "white");

    drawText(playerScore, canvas.width / 4, canvas.height / 6, "white");
    drawText(aiScore, 3 * canvas.width / 4, canvas.height / 6, "white");

    // ball movement logic
    ball.x += ball.dx;
    ball.y += ball.dy;

    if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
        ball.dy *= -1; // reverse ball direction if it hits top/bottom
    }

    // AI paddle movement logic
    // AI paddle movement logic
    if(aiPaddle.y < ball.y - aiPaddle.height/2) {
        aiPaddle.y += aiPaddle.dy;
    } else if(aiPaddle.y > ball.y - aiPaddle.height/2) {
        aiPaddle.y -= aiPaddle.dy;
    }

    if(aiPaddle.y < 0) aiPaddle.y = 0;
    if(aiPaddle.y + aiPaddle.height > canvas.height) aiPaddle.y = canvas.height - aiPaddle.height;


    // collision detection with paddles
    if (ball.dx < 0) {
        if (ball.x - ball.radius < playerPaddle.x + playerPaddle.width && ball.y > playerPaddle.y && ball.y < playerPaddle.y + playerPaddle.height) {
            ball.dx *= -1;
        }
    } else if (ball.dx > 0) {
        if (ball.x + ball.radius > aiPaddle.x && ball.y > aiPaddle.y && ball.y < aiPaddle.y + aiPaddle.height) {
            ball.dx *= -1;
        }
    }

    // player paddle movement logic
    if (upArrowPressed && playerPaddle.y > 0) {
        playerPaddle.y -= playerPaddle.dy;
    } else if (downArrowPressed && (playerPaddle.y < canvas.height - playerPaddle.height)) {
        playerPaddle.y += playerPaddle.dy;
    }

    // scoring logic
    if (ball.x + ball.radius > canvas.width) {
        if (ball.y > aiPaddle.y && ball.y < aiPaddle.y + aiPaddle.height) {
            // Ball hit the AI paddle, reverse its direction
            ball.dx *= -1;
        } else {
            // Ball passed AI paddle, player scores a point
            playerScore++;
            resetBall();
        }
    } else if (ball.x - ball.radius < 0) {
        if (ball.y > playerPaddle.y && ball.y < playerPaddle.y + playerPaddle.height) {
            // Ball hit the player paddle, reverse its direction
            ball.dx *= -1;
        } else {
            // Ball passed player paddle, AI scores a point
            aiScore++;
            resetBall();
        }
    }
}

function loop() {
    if (!gamePaused) {  // Only update if the game is not paused
        update();
    }
    if (typeof requestAnimationFrame == "function") {
        requestAnimationFrame(loop);
    } else {
        setTimeout(loop, 20); // for older browsers
    }
}

function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.dx = -ball.dx;
}

document.getElementById('pauseButton').addEventListener('click', function () {
    // If a game is not active, do nothing
    if (!gameActive) return;
    gamePaused = !gamePaused;
}, false);

document.getElementById('newGameButton').addEventListener('click', function () {
    // Set the game as active
    gameActive = true;
    // Reset the game state
    playerScore = 0;
    aiScore = 0;
    resetBall();
    gamePaused = false;
}, false);

loop(); // start the game loop


