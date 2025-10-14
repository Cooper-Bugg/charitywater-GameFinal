// Variables to control game state
let gameRunning = false; // Keeps track of whether game is active or not
let dropMaker; // Will store our timer that creates drops regularly
let timerInterval; // Stores the timer interval
let timeLeft = 30; // 30 seconds for the game
let score = 0; // Player's score
let currentDifficulty = 'normal'; // Current difficulty level
let difficultySettings = {
  easy: {
    timeLimit: 45,
    spawnInterval: 1200,
    badDropChance: 0.15,
    goalScore: 15,
    fallDuration: 5
  },
  normal: {
    timeLimit: 30,
    spawnInterval: 1000,
    badDropChance: 0.20,
    goalScore: 20,
    fallDuration: 4
  },
  hard: {
    timeLimit: 25,
    spawnInterval: 500,
    badDropChance: 0.25,
    goalScore: 25,
    fallDuration: 3
  }
};

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

// Fun facts about charity: water
const funFacts = [
  "charity: water has funded over 91,000 water projects in 29 countries.",
  "771 million people in the world live without clean water.",
  "Every $1 invested in clean water can yield $4-$12 in economic returns.",
  "Women and children spend 200 million hours every day collecting water.",
  "charity: water uses 100% of public donations to fund water projects.",
  "Diseases from unsafe water kill more people every year than all forms of violence, including war.",
  "Clean water helps keep kids in school, especially girls.",
  "Access to clean water can give communities in developing countries more time to grow food, earn income, and go to school.",
  "charity: water was founded in 2006 by Scott Harrison.",
  "Every water project funded by charity: water is proven with GPS coordinates and photos."
];

// Get DOM elements for score, timer, goal, and game container
const scoreEl = document.getElementById("score");
const timeEl = document.getElementById("time");
const goalEl = document.getElementById("goal");
const gameContainer = document.getElementById("game-container");
const difficultySelect = document.getElementById("difficulty");

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
messageEl.style.maxWidth = "90%";
gameContainer.appendChild(messageEl);

// Create a fun fact element
let funFactEl = document.createElement("div");
funFactEl.id = "fun-fact";
funFactEl.style.marginTop = "20px";
funFactEl.style.fontSize = "1rem";
funFactEl.style.fontStyle = "italic";
funFactEl.style.color = "#2E9DF7";
funFactEl.style.lineHeight = "1.5";
funFactEl.style.borderTop = "2px solid #FFC907";
funFactEl.style.paddingTop = "16px";
messageEl.appendChild(funFactEl);

// Wait for button click to start the game
document.getElementById("start-btn").addEventListener("click", startGame);
document.getElementById("reset-btn").addEventListener("click", resetGame);

// Update difficulty when changed
difficultySelect.addEventListener("change", (e) => {
  currentDifficulty = e.target.value;
  updateDifficultyDisplay();
});

// Update the display based on current difficulty
function updateDifficultyDisplay() {
  const settings = difficultySettings[currentDifficulty];
  timeEl.textContent = settings.timeLimit;
  goalEl.textContent = settings.goalScore;
}

function startGame() {
  // Prevent multiple games from running at once
  if (gameRunning) return;

  // Get current difficulty settings
  currentDifficulty = difficultySelect.value;
  const settings = difficultySettings[currentDifficulty];

  // Reset game state with difficulty settings
  gameRunning = true;
  score = 0;
  timeLeft = settings.timeLimit;
  scoreEl.textContent = score;
  timeEl.textContent = timeLeft;
  goalEl.textContent = settings.goalScore;
  messageEl.style.display = "none";

  // Disable difficulty selection during game
  difficultySelect.disabled = true;

  // Remove any remaining drops
  Array.from(document.getElementsByClassName("water-drop")).forEach(drop => drop.remove());

  // Start creating drops based on difficulty
  dropMaker = setInterval(createDrop, settings.spawnInterval);

  // Start the timer
  timerInterval = setInterval(updateTimer, 1000);
}

function createDrop() {
  // Get current difficulty settings
  const settings = difficultySettings[currentDifficulty];
  
  // Create a new div element that will be our water can
  const drop = document.createElement("div");
  
  // Bad drop chance based on difficulty
  const isBadDrop = Math.random() < settings.badDropChance;
  drop.className = isBadDrop ? "water-drop bad-drop" : "water-drop";

  // Create an image element for the water can
  const canImg = document.createElement("img");
  canImg.src = "img/water-can-transparent.png";
  canImg.alt = "Water can";
  canImg.style.width = "100%";
  canImg.style.height = "100%";
  canImg.style.pointerEvents = "none"; // Let clicks pass through to the parent div
  drop.appendChild(canImg);

  // Make drops different sizes for visual variety
  const initialSize = 80;
  const sizeMultiplier = Math.random() * 0.8 + 0.5;
  const size = initialSize * sizeMultiplier;
  drop.style.width = drop.style.height = `${size}px`;

  // Position the drop randomly across the game width
  // Subtract size to keep drops fully inside the container
  const gameWidth = gameContainer.offsetWidth;
  const xPosition = Math.random() * (gameWidth - size);
  drop.style.left = xPosition + "px";

  // Make drops fall at different speeds based on difficulty
  drop.style.animationDuration = `${settings.fallDuration}s`;

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

  // Re-enable difficulty selection
  difficultySelect.disabled = false;

  // Remove all drops
  Array.from(document.getElementsByClassName("water-drop")).forEach(drop => drop.remove());

  // Pick a message based on score and difficulty goal
  const settings = difficultySettings[currentDifficulty];
  const goalMet = score >= settings.goalScore;
  let messageArr = goalMet ? winMessages : loseMessages;
  let msg = messageArr[Math.floor(Math.random() * messageArr.length)];
  
  // Pick a random fun fact
  let fact = funFacts[Math.floor(Math.random() * funFacts.length)];
  
  // Clear previous content and add new content
  messageEl.innerHTML = '';
  let mainMessage = document.createElement("div");
  mainMessage.textContent = goalMet ? `🎉 ${msg}` : `😅 ${msg}`;
  messageEl.appendChild(mainMessage);
  
  // Re-create and add fun fact element
  funFactEl = document.createElement("div");
  funFactEl.id = "fun-fact";
  funFactEl.style.marginTop = "20px";
  funFactEl.style.fontSize = "1rem";
  funFactEl.style.fontStyle = "italic";
  funFactEl.style.color = "#2E9DF7";
  funFactEl.style.lineHeight = "1.5";
  funFactEl.style.borderTop = "2px solid #FFC907";
  funFactEl.style.paddingTop = "16px";
  funFactEl.innerHTML = `<strong>💧 Fun Fact:</strong> ${fact}`;
  messageEl.appendChild(funFactEl);
  
  messageEl.style.display = "block";
}

// Reset the game to initial state
function resetGame() {
  // Stop the game if running
  if (gameRunning) {
    gameRunning = false;
    clearInterval(dropMaker);
    clearInterval(timerInterval);
  }
  
  // Re-enable difficulty selection
  difficultySelect.disabled = false;
  
  // Remove all drops
  Array.from(document.getElementsByClassName("water-drop")).forEach(drop => drop.remove());
  
  // Reset all values based on current difficulty
  const settings = difficultySettings[currentDifficulty];
  score = 0;
  timeLeft = settings.timeLimit;
  scoreEl.textContent = score;
  timeEl.textContent = timeLeft;
  goalEl.textContent = settings.goalScore;
  messageEl.style.display = "none";
}