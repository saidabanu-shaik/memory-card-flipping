
const images = {
  easy: [
      'https://i.pinimg.com/474x/4e/0a/20/4e0a208c76ab288dbfa3e1cacb6555ef.jpg',
      'https://i.pinimg.com/474x/09/15/ad/0915adb3934e6ea1016ba7d17e4acc72.jpg',
  ],
  medium: [
      'https://i.pinimg.com/474x/4e/0a/20/4e0a208c76ab288dbfa3e1cacb6555ef.jpg',
      'https://i.pinimg.com/474x/09/15/ad/0915adb3934e6ea1016ba7d17e4acc72.jpg',
      'https://i.pinimg.com/474x/e8/ab/aa/e8abaa76d30070152ace9f50c6b4adbb.jpg',
  ],
  hard: [
      'https://i.pinimg.com/474x/4e/0a/20/4e0a208c76ab288dbfa3e1cacb6555ef.jpg',
      'https://i.pinimg.com/474x/09/15/ad/0915adb3934e6ea1016ba7d17e4acc72.jpg',
      'https://i.pinimg.com/474x/e8/ab/aa/e8abaa76d30070152ace9f50c6b4adbb.jpg',
      'https://i.pinimg.com/474x/fa/d4/e1/fad4e1458420e045eda6be90833db4cd.jpg',
  ],
};

let firstCard, secondCard;
let hasFlippedCard = false;
let lockBoard = false;
let score = 0;
let attempts = 0;
let timeLeft = 30;
let timer;
let isPaused = false;

const grid = document.getElementById('grid');
const scoreDisplay = document.getElementById('score');
const attemptsDisplay = document.getElementById('attempts');
const timeDisplay = document.getElementById('time');
const startButton = document.getElementById('start');
const pauseButton = document.getElementById('pause');
const stopButton = document.getElementById('stop');
const restartButton = document.getElementById('restart');
const playAgainButton = document.getElementById('playAgain');
const levelSelect = document.getElementById('level');



levelSelect.addEventListener('change', function () {
  const selectedLevel = this.value;
  showInstructions(selectedLevel);

  switch (selectedLevel) {
      case 'easy':
          timeLeft = 10; // 10 seconds for easy
          break;
      case 'medium':
          timeLeft = 20; // 20 seconds for medium
          break;
      case 'hard':
          timeLeft = 30; // 30 seconds for hard
          break;
      default:
          timeLeft = 30; // Reset to default if needed
  }
});

function showInstructions(level) {
  let instructions;

  switch (level) {
      case 'easy':
          instructions = "Easy Level Instructions:\n- You will match 2 pairs of cards.\n- The time limit is 10 seconds.";
          break;
      case 'medium':
          instructions = "Medium Level Instructions:\n- You will match 3 pairs of cards.\n- The time limit is 20 seconds.";
          break;
      case 'hard':
          instructions = "Hard Level Instructions:\n- You will match 4 pairs of cards.\n- The time limit is 30 seconds.";
          break;
      default:
          instructions = "Please select a difficulty level.";
  }

  alert(instructions);
}






levelSelect.addEventListener('change', function() {
  updateTimeLeft(); // Call to set the time left when level changes
});


function updateTimeLeft() {
  switch (levelSelect.value) {
    case 'easy':
      timeLeft = 10; // 10 seconds for easy
      break;
    case 'medium':
      timeLeft = 20; // 20 seconds for medium
      break;
    case 'hard':
      timeLeft = 30; // 30 seconds for hard
      break;
    default:
      timeLeft = 30; // Default fallback
  }
  timeDisplay.textContent = timeLeft; // Update displayed time
}




function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

function createBoard() {
  const selectedLevel = levelSelect.value;
  const selectedImages = shuffle([...images[selectedLevel], ...images[selectedLevel]]);
  grid.innerHTML = '';

  selectedImages.forEach(image => {
      const card = document.createElement('div');
      card.classList.add('card');
      card.dataset.image = image;

      const cardInner = document.createElement('div');
      cardInner.classList.add('card-inner');

      const front = document.createElement('div');
      front.classList.add('card-front');

      const back = document.createElement('div');
      back.classList.add('card-back');
      back.style.backgroundImage = `url(${image})`;

      cardInner.appendChild(front);
      cardInner.appendChild(back);
      card.appendChild(cardInner);
      card.addEventListener('click', flipCard);
      grid.appendChild(card);
  });
}

function flipCard() {
  if (lockBoard || this === firstCard) return;

  this.classList.add('flipped');
  if (!hasFlippedCard) {
      hasFlippedCard = true;
      firstCard = this;
      return;
  }

  secondCard = this;
  checkForMatch();
}

function checkForMatch() {
  attempts++;
  attemptsDisplay.textContent = attempts;

  const isMatch = firstCard.dataset.image === secondCard.dataset.image;
  isMatch ? disableCards() : unflipCards();
}

function disableCards() {
  score++;
  scoreDisplay.textContent = score;
  resetBoard();
  
  const selectedLevel = levelSelect.value;
  const totalPairs = images[selectedLevel].length; // Number of unique images

  if (score === totalPairs) {
    clearInterval(timer); // Stop the timer
    alert(`Congratulations! You've matched all the pairs! Your final score: ${score}`);
    stopGame(); // Clear the board and show play again button
  }
}

function unflipCards() {
  lockBoard = true;

  setTimeout(() => {
      firstCard.classList.remove('flipped');
      secondCard.classList.remove('flipped');
      resetBoard();
  }, 1000);
}

function resetBoard() {
  [hasFlippedCard, lockBoard, firstCard, secondCard] = [false, false, null, null];
}

function startGame() {
  createBoard();
  score = 0;
  attempts = 0;
  updateTimeLeft(); // Set the timer based on selected level
  scoreDisplay.textContent = score;
  attemptsDisplay.textContent = attempts;
  timeDisplay.textContent = timeLeft;

  clearInterval(timer);
  isPaused = false;
  timer = setInterval(updateTimer, 1000);
}

function pauseGame() {
  isPaused = true;
  clearInterval(timer);
  alert("Game Paused. Click 'Resume' to continue.");
}

function stopGame() {
  clearInterval(timer);
  alert(`Game Stopped. Your final score: ${score}`);
  grid.innerHTML = ''; // Clear the board
  playAgainButton.style.display = 'block'; // Show play again button
}

function restartGame() {
  stopGame();
  startGame(); // Restart the game
  playAgainButton.style.display = 'none'; // Hide play again button
}

function updateTimer() {
  if (isPaused) return; // Don't update time if paused

  timeLeft--;
  timeDisplay.textContent = timeLeft;

  if (timeLeft <= 0) {
      clearInterval(timer);
      alert(`Time's up! Your score: ${score}`);
      stopGame(); // Clear the board on timeout
  }
}

// Event Listeners
startButton.addEventListener('click', startGame);
pauseButton.addEventListener('click', pauseGame);
stopButton.addEventListener('click', stopGame);
restartButton.addEventListener('click', restartGame);
playAgainButton.addEventListener('click', () => {
  playAgainButton.style.display = 'none'; // Hide play again button
  startGame();
});
