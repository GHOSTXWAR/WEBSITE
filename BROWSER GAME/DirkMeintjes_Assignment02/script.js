//  Key UI components -DOM key elements
 const startBtn = document.getElementById('startBtn');
   const retryBtn = document.getElementById('retryBtn');
  const backToStartBtn = document.getElementById('backToStartBtn');
const startMenu = document.getElementById('startMenu');
  const gameContainer = document.getElementById('gameContainer');
const gameOverScreen = document.getElementById('gameOver');
  const character = document.getElementById('character');
const scoreDisplay = document.getElementById('score');
 const highScoreDisplay = document.getElementById('highScore');
const obstacleContainer = document.getElementById('obstacleContainer');
 const volumeSlider = document.getElementById('volumeSlider');

const backgroundMusic = document.getElementById('backgroundMusic');
const jumpSound = document.getElementById('jumpSound');
const deathSound = document.getElementById('deathSound');

  let isGameOver = false;
 let isJumping = false;
  let score = 0;
let highScore = 0;
  let gameLoopRunning = false;
let lastSpawnTime = 0;
  let lastFrameTime = 0;
let blockSpeed = 3;
  
let activeObstacles = [];

//  list of obsticals there image -size and postion data      
const obstacleData = [
    { name: 'Cactus A', image: 'Assets/Images/Cactus A.png', width: 40, height: 90, bottom: 25 },
{ name: 'Cactus B', image: 'Assets/Images/Cactus B.png', width: 64, height: 64, bottom: 30 },
  { name: 'Cactus C', image: 'Assets/Images/Cactus C.png', width: 64, height: 64, bottom: 30 },
   { name: 'Rock A', image: 'Assets/Images/Rock A.png', width: 64, height: 64, bottom: 15 }
];

// Event handlers for game controls
startBtn.addEventListener('click', startGame);
 retryBtn.addEventListener('click', retryGame);
backToStartBtn.addEventListener('click', backToStartMenu);

//  adjust all volume for game background/game effect sounds based on volume slider input
    volumeSlider.addEventListener('input', () => {
 const volume = parseFloat(volumeSlider.value);
   backgroundMusic.volume = volume;
 jumpSound.volume = volume;
   deathSound.volume = volume;
});

// start game button - starts game
function startGame() {
 startMenu.style.display = 'none';
    gameContainer.classList.remove('blurred');
 gameContainer.classList.add('active');
  resetGame();
}

// Retry button-restart/retry game
function retryGame() {
   gameOverScreen.style.display = 'none';
     gameContainer.classList.remove('blurred');
  gameContainer.classList.add('active');
  resetGame();
}

// back to start menu button- returns player to main menu/start menu of game
 function backToStartMenu() {
gameOverScreen.style.display = 'none';
 gameContainer.classList.add('blurred');
  gameContainer.classList.remove('active');
 startMenu.style.display = 'block';
    backgroundMusic.pause();
 clearObstacles();
   resetCharacter();
 isGameOver = true;
  gameLoopRunning = false;
}

// strats the main game loop and resets all game variables
  function resetGame() {
   isGameOver = false;
  isJumping = false;
 score = 0;
  blockSpeed = 3;
    scoreDisplay.textContent = `Score: ${score}`;
 clearObstacles();
   resetCharacter();
  lastSpawnTime = 0;
   lastFrameTime = 0;
 backgroundMusic.play();
  if (!gameLoopRunning) {
    gameLoopRunning = true;
    requestAnimationFrame(gameLoop);
  }
}

//  postion and appereance reset for character
function resetCharacter() {
  character.style.bottom = '50px';
   character.classList.remove('animateJump');
  character.classList.add('animateRun');
}

//  positions and creates obstical - on the right side of the black border
function spawnObstacle() {
 const index = Math.floor(Math.random() * obstacleData.length);
   const data = obstacleData[index];

   const obs = document.createElement('div');
  obs.classList.add('obstacle');
   obs.style.width = data.width + 'px';
    obs.style.height = data.height + 'px';
obs.style.backgroundImage = `url('${data.image}')`;
   obs.style.bottom = data.bottom + 'px';
  obs.style.left = '600px';

  obstacleContainer.appendChild(obs);

  activeObstacles.push({
     element: obs,
   x: 600,
     width: data.width,
  bottom: data.bottom,
    height: data.height,
   passed: false
  });
}

// removes all obstical from the screen once it passes the border
    function clearObstacles() {
   activeObstacles.forEach(o => {
     if (o.element.parentNode) {
      o.element.parentNode.removeChild(o.element);
    }
  });
 activeObstacles = [];
}

//(score and collision-handle)-(manage and move onstacles)
function updateObstacles(deltaTime) {
  for (let i = activeObstacles.length - 1; i >= 0; i--) {
      let obs = activeObstacles[i];
   obs.x -= blockSpeed;
     obs.element.style.left = obs.x + 'px';

     if (obs.x + obs.width < 0) {
       if (obs.element.parentNode) {
        obs.element.parentNode.removeChild(obs.element);
      }
      activeObstacles.splice(i, 1);
      continue;
    }

    // character collision checker
    if (!isJumping && !isGameOver) {
      const charLeft = 10;
        const charRight = charLeft + 32;
      const charBottom = 50;

      const obsLeft = obs.x;
       const obsRight = obs.x + obs.width;
      const obstacleTop = obs.bottom + obs.height - 10;
          const obstacleBottom = obs.bottom + 10;
 
        const horizontalCollision = (charRight > obsLeft + 5) && (charLeft < obsRight - 5);
      const verticalCollision = (charBottom > obstacleBottom) && (charBottom < obstacleTop);

      if (horizontalCollision && verticalCollision) {
        gameOver();
      }
    }

    // increase the speed after obstical is passed - to increase game diffuclty of game
    if (!obs.passed && obs.x + obs.width < 10) {
       score++;
      scoreDisplay.textContent = `Score: ${score}`;
        obs.passed = true;

      if (score % 5 === 0 && blockSpeed < 10) {
         blockSpeed++;
      }
    }
  }
}

// move ground image to animate it
function moveGround() {
     const ground = document.getElementById('ground');
  const currentPos = parseInt(ground.style.backgroundPositionX) || 0;
 ground.style.backgroundPositionX = (currentPos - blockSpeed) + 'px';
}

// main animated loop
function gameLoop(timestamp) {
 if (!lastFrameTime) lastFrameTime = timestamp;
  const deltaTime = timestamp - lastFrameTime;

   if (isGameOver) {
      gameLoopRunning = false;
    return;
  }

  if (!lastSpawnTime || timestamp - lastSpawnTime > 1500) {
    spawnObstacle();
      lastSpawnTime = timestamp;
  }

    updateObstacles(deltaTime);
   moveGround();

  lastFrameTime = timestamp;
 requestAnimationFrame(gameLoop);
}

// jump input - handle
 window.addEventListener('keydown', (e) => {
  if ((e.code === 'Space' || e.code === 'ArrowUp') && !isJumping && !isGameOver && gameLoopRunning) {
    isJumping = true;
     character.classList.remove('animateRun');
    character.classList.add('animateJump');
  jumpSound.currentTime = 0;
    jumpSound.play();

    setTimeout(() => {
      isJumping = false;
      if (!isGameOver) {
        character.classList.remove('animateJump');
          character.classList.add('animateRun');
       character.style.bottom = '50px';
      }
    }, 800);
  }
});

// end game and show game over screen
function gameOver() {
  isGameOver = true;
   deathSound.currentTime = 0;
 deathSound.play();
   backgroundMusic.pause();

   gameOverScreen.style.display = 'block';
  gameContainer.classList.add('blurred');
 gameContainer.classList.remove('active');

  if (score > highScore) {
  highScore = score;
     highScoreDisplay.textContent = `High Score: ${highScore}`;
  }
}

// Volume slider set value
 backgroundMusic.volume = parseFloat(volumeSlider.value);
jumpSound.volume = parseFloat(volumeSlider.value);
   deathSound.volume = parseFloat(volumeSlider.value);


const backToPortfolio1 = document.getElementById('backToPortfolio1');
if (backToPortfolio1) {
  backToPortfolio1.addEventListener('click', () => {
     window.location.href = '../../index.html'; 
  });
}

const backToPortfolio2 = document.getElementById('backToPortfolio2');
if (backToPortfolio2) {
  backToPortfolio2.addEventListener('click', () => {
    window.location.href = '../../index.html';
  });
}
