// Define variables
let canvas = document.getElementById("gameCanvas");
let ctx = canvas.getContext("2d");
let animationFrameId;
let textColor = "#c2c7ac";
let playerWidth = 50;
let playerHeight = 50;
let playerX = 50;
let playerY = canvas.height / 2 - playerHeight / 2; // Center the player vertically
let score = 0;
let lives = 3; // Number of lives for the player
let isGameOver = false;
let goals = [];
let obstacles = [];
let playerSpeed = 50;
let goalSpeed = 5; // Speed of goals
let obstacleSpeed = 10; // Speed of obstacles

let startButton = document.getElementById("startButton"); // Get the start button element
let restartButton = document.getElementById("restartButton"); // Get the restart button element

let playerImage = new Image(); // Create an image object for the player
playerImage.src = "./img/player.png"; // Path to your player image file

let obstacleImage = new Image();
obstacleImage.src = "./img/danger.png";

let goalsImage = new Image();
goalsImage.src = "./img/goals.png";

// Function to create a new goal
function createGoal() {
  return {
    x: canvas.width,
    y: randomInt(0, canvas.height - 50), // Adjusted goal position within canvas height
    width: 40,
    height: 30,
  };
}

// Function to create a new obstacle
function createObstacle() {
  return {
    x: canvas.width,
    y: randomInt(0, canvas.height - 50), // Adjusted obstacle position within canvas height
    width: 30,
    height: 30,
  };
}

// Function to generate random integer within a range
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

// Function to check collision with goals
function checkGoalCollision() {
  goals.forEach(function (goal) {
    if (
      playerX < goal.x + goal.width &&
      playerX + playerWidth > goal.x &&
      playerY < goal.y + goal.height &&
      playerY + playerHeight > goal.y
    ) {
      // Goal collected
      score++;
      // Remove goal
      goals.splice(goals.indexOf(goal), 1);
    }
  });
}

// Function to check collision with obstacles
function checkObstacleCollision() {
  obstacles.forEach(function (obstacle) {
    if (
      playerX < obstacle.x + obstacle.width &&
      playerX + playerWidth > obstacle.x &&
      playerY < obstacle.y + obstacle.height &&
      playerY + playerHeight > obstacle.y
    ) {
      // Collision detected
      lives--;
      if (lives <= 0) {
        // Game over if no lives left
        isGameOver = true;
      }
      // Remove obstacle
      obstacles.splice(obstacles.indexOf(obstacle), 1);
    }
  });
}

// Main game loop
function gameLoop() {
  // Update game state
  update();
  // Render graphics
  draw();
  if (isGameOver) return;
  // Request next frame
  animationFrameId = requestAnimationFrame(gameLoop);
}
// Function to stop the game loop
function stopGame() {
  cancelAnimationFrame(animationFrameId);
}

// Update game state
function update() {
  // Move goals
  goals.forEach(function (goal) {
    goal.x -= goalSpeed;
  });

  // Move obstacles
  obstacles.forEach(function (obstacle) {
    obstacle.x -= obstacleSpeed;
  });

  // Check collision with goals
  checkGoalCollision();

  // Check collision with obstacles
  checkObstacleCollision();

  // Generate new goals
  if (Math.random() < 0.01) {
    // Adjusted goal generation frequency
    goals.push(createGoal());
  }

  // Generate new obstacles
  if (Math.random() < 0.005) {
    // Adjusted obstacle generation frequency
    obstacles.push(createObstacle());
  }
  // Check if the player has run out of lives
  if (lives <= 0) {
    endGame(); // Call endGame() when the player runs out of lives
  }
}

// Render graphics
function draw() {
  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw player character
  ctx.drawImage(playerImage, playerX, playerY, playerWidth, playerHeight);

  // Draw goals
  goals.forEach(function (goal) {
    ctx.drawImage(goalsImage, goal.x, goal.y, goal.width, goal.height);
  });

  // Draw obstacles
  obstacles.forEach(function (obstacle) {
    ctx.drawImage(
      obstacleImage,
      obstacle.x,
      obstacle.y,
      obstacle.width,
      obstacle.height
    );
  });

  // Draw score
  ctx.fillStyle = "#08a045";
  ctx.font = "24px Arial";
  ctx.fillText("Goals Achieved: " + score, 10, 30);

  // Draw lives
  ctx.fillStyle = textColor;
  ctx.font = "24px Arial";
  ctx.fillText("Lives: " + lives, 10, 60);

  // Draw game over screen if game is over
  if (isGameOver) {
    ctx.fillStyle = "red";
    ctx.font = "48px Arial";
    ctx.fillText("Game Over", canvas.width / 2 - 150, canvas.height / 2);
    restartButton.style.display = "block"; // Show restart button
  } else {
    restartButton.style.display = "none"; // Hide restart button during gameplay
  }
}
// Function to handle touch start event
function handleTouchStart(event) {
  // Prevent default touch behavior (e.g., scrolling)
  event.preventDefault();

  // Get the touch position relative to the canvas
  let touchY = event.touches[0].clientY - canvas.getBoundingClientRect().top - playerHeight;

  // Handle touch start
  playerY = touchY;
}

// Function to handle touch move event
function handleTouchMove(event) {
  // Prevent default touch behavior (e.g., scrolling)
  event.preventDefault();

  // Get the touch position relative to the canvas
  let touchY = event.touches[0].clientY - canvas.getBoundingClientRect().top - playerHeight;

  // Handle touch move
  playerY = touchY < 0 ? 0 : touchY < canvas.height - playerHeight ? touchY : canvas.height - playerHeight;
}

// Handle player movement
document.addEventListener("keydown", function (event) {
  event.preventDefault();
  if (event.key === "ArrowUp" && playerY > 0) {
    playerY -= playerSpeed; // Adjusted player movement speed
  } else if (
    event.key === "ArrowDown" &&
    playerY < canvas.height - playerHeight
  ) {
    playerY += playerSpeed; // Adjusted player movement speed
  } else if (
    event.key === "ArrowRight" &&
    playerX < canvas.width - playerWidth
  ) {
    playerX += playerSpeed; // Adjusted player movement speed
  } else if (event.key === "ArrowLeft" && playerX > 0) {
    playerX -= playerSpeed; // Adjusted player movement speed
  }
});
canvas.addEventListener("touchstart", handleTouchStart, false);
canvas.addEventListener("touchmove", handleTouchMove, false);
// Start button event listener
startButton.addEventListener("click", function () {
  // Remove previous event listener
  startButton.removeEventListener("click", arguments.callee);
  startGame();
});

// Restart button event listener
function listenRestartClick() {
  restartButton.addEventListener("click", function () {
    // Remove previous event listener
    restartButton.removeEventListener("click", arguments.callee);
    if (!isGameOver) {
      return; // Exit if game is already running
    }
    startGame();
  });
}

// Function to start the game
function startGame() {
  // Reset game variables
  startButton.style.display = "none"; // Hide restart button during gameplay
  score = 0;
  lives = 3;
  isGameOver = false;
  goals = [];
  obstacles = [];
  // Hide restart button
  restartButton.style.display = "none";
  // Start the game loop
  gameLoop();
}

// Function to end the game
function endGame() {
  isGameOver = true;
  stopGame(); // Stop the game loop
  restartButton.style.display = "block"; // Show the restart button
  listenRestartClick();
}
