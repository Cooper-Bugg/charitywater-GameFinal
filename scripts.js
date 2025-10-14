// Variables to control game state
let gameRunning = false; // Keeps track of whether game is active or not
let dropMaker; // Will store our timer that creates drops regularly
let timerInterval; // Stores the timer interval
let timeLeft = 30; // 30 seconds for the game
let score = 0; // Player's score

// Arrays of possible messages
const winMessages = [
  "Amazing! You brought clean water! 💧",
  "You did it! Every drop counts!",
  "Winner! You made a big impact!",
  "Great job! You helped change lives!"
];
const loseMessages = [
  "Try again! Every drop helps.",
  "Keep going! You can do it!",
  "Almost there! Give it another shot!",
  "Don't give up! Water is life!"
];

// Get DOM elements for score, timer, and game container
const scoreEl = document.getElementById("score");
const timeEl = document.getElementById("time");
const gameContainer = document.getElementById("game-container");

// Create a message element for end-of-game messages
let messageEl = document.createElement("div");
messageEl.id = "end-message";
messageEl.style.display = "none";
messageEl.style.position = "absolute";
messageEl.style.top = "50%";
messageEl.style.left = "50%";
messageEl.style.transform = "translate(-50%, -50%)";
messageEl.style.background = "#fff";
messageEl.style.padding = "32px 24px";
messageEl.style.borderRadius = "12px";
messageEl.style.boxShadow = "0 4px 16px rgba(0,0,0,0.15)";
messageEl.style.fontSize = "2rem";
messageEl.style.textAlign = "center";
messageEl.style.zIndex = "10";
gameContainer.appendChild(messageEl);

// Wait for button click to start the game
document.getElementById("start-btn").addEventListener("click", startGame);

function startGame() {
  // Prevent multiple games from running at once
  if (gameRunning) return;

  // Reset game state
  gameRunning = true;
  score = 0;
  timeLeft = 30;
  scoreEl.textContent = score;
  timeEl.textContent = timeLeft;
  messageEl.style.display = "none";

  // Remove any remaining drops
  Array.from(document.getElementsByClassName("water-drop")).forEach(drop => drop.remove());

  // Start creating drops every second
  dropMaker = setInterval(createDrop, 1000);

  // Start the timer
  timerInterval = setInterval(updateTimer, 1000);
}

function createDrop() {
  // Create a new div element that will be our water drop
  const drop = document.createElement("div");
  
  // 20% chance to create a bad drop (red)
  const isBadDrop = Math.random() < 0.2;
  drop.className = isBadDrop ? "water-drop bad-drop" : "water-drop";

  // Make drops different sizes for visual variety
  const initialSize = 60;
  const sizeMultiplier = Math.random() * 0.8 + 0.5;
  const size = initialSize * sizeMultiplier;
  drop.style.width = drop.style.height = `${size}px`;

  // Position the drop randomly across the game width
  // Subtract 60 pixels to keep drops fully inside the container
  const gameWidth = gameContainer.offsetWidth;
  const xPosition = Math.random() * (gameWidth - 60);
  drop.style.left = xPosition + "px";

  // Make drops fall for 4 seconds
  drop.style.animationDuration = "4s";

  // Add the new drop to the game screen
  gameContainer.appendChild(drop);

  // When the drop is clicked, increase or decrease score based on drop type
  drop.addEventListener("click", () => {
    if (!gameRunning) return; // Only count clicks if game is running
    
    if (isBadDrop) {
      // Bad drop: subtract 2 points (but don't go below 0)
      score = Math.max(0, score - 2);
    } else {
      // Good drop: add 1 point
      score += 1;
    }
    
    scoreEl.textContent = score;
    drop.remove();
  });

  // Remove drops that reach the bottom (weren't clicked)
  drop.addEventListener("animationend", () => {
    drop.remove(); // Clean up drops that weren't caught
  });
}

// Update the timer every second
function updateTimer() {
  timeLeft -= 1;
  timeEl.textContent = timeLeft;
  if (timeLeft <= 0) {
    endGame();
  }
}

// End the game, stop timers, show message
function endGame() {
  gameRunning = false;
  clearInterval(dropMaker);
  clearInterval(timerInterval);

  // Remove all drops
  Array.from(document.getElementsByClassName("water-drop")).forEach(drop => drop.remove());

  // Pick a message based on score
  let messageArr = score >= 20 ? winMessages : loseMessages;
  let msg = messageArr[Math.floor(Math.random() * messageArr.length)];
  messageEl.textContent = score >= 20 ? `🎉 ${msg}` : `😅 ${msg}`;
  messageEl.style.display = "block";
}