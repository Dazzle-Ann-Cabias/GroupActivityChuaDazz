/* ===============================
   KUHA NG MGA HTML ELEMENTS
================================ */
const home = document.getElementById("home");
const game = document.getElementById("game");
const arena = document.getElementById("arena");
const message = document.getElementById("message");
const roundBtn = document.getElementById("roundBtn");

const p1Score = document.getElementById("p1Score");
const p2Score = document.getElementById("p2Score");
const turnDisplay = document.getElementById("turn");
const timerDisplay = document.getElementById("timer");

const winnerOverlay = document.getElementById("winnerOverlay");
const winnerText = document.getElementById("winnerText");

/* ===============================
   GAME STATE (memory ng game)
================================ */
let boxes = [];              // lahat ng boxes
let correctIndex = -1;       // index ng box na MAY NUMBER 1
let active = false;          // pwede na bang pumili?

let scores = [0, 0];         // score ng players
let lives = [3, 3];          // 3 buhay bawat player
let currentPlayer = 0;       // 0 = P1, 1 = P2

let firstRound = true;
let gameOver = false;

let timerInterval = null;
let timeRemaining = 120;     // 2 minutes

/* ===============================
   PAGE NAVIGATION
================================ */
function enterGame() {
    home.style.display = "none";
    game.style.display = "flex";
    restartGame();
}

function backToHome() {
    stopTimer();
    game.style.display = "none";
    home.style.display = "flex";
}

/* ===============================
   RESET GAME
================================ */
function restartGame() {
    scores = [0, 0];
    lives = [3, 3];
    currentPlayer = 0;
    firstRound = true;
    gameOver = false;

    arena.innerHTML = "";
    message.textContent = "The ritual begins.";
    winnerOverlay.style.display = "none";

    stopTimer();
    timeRemaining = 120;
    updateTimerDisplay();
    updateScores();
}

/* ===============================
   GUMAGAWA NG MGA BOX
   (WALANG NUMBER BY DEFAULT)
================================ */
function setupArena(count, cols) {
    arena.innerHTML = "";
    arena.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    boxes = [];

    for (let i = 0; i < count; i++) {
        const box = document.createElement("div");
        box.className = "box";

        const orb = document.createElement("div");
        orb.className = "orb";
        orb.textContent = ""; // IMPORTANT: blank lahat

        box.appendChild(orb);
        box.onclick = () => chooseBox(i);

        arena.appendChild(box);
        boxes.push(box);
    }
}

/* ===============================
   START ROUND LOGIC
================================ */
function startRound() {
    if (gameOver) return;

    if (firstRound) {
        startTimer();
        firstRound = false;
    }

    const diff = document.getElementById("difficulty").value;
    const boxCount = diff === "hard" ? 20 : 10;
    const orbCount = diff === "hard" ? 8 : 6;
    const reveal = diff === "hard" ? 500 : 1000;

    setupArena(boxCount, 5);
    active = false;

    // shuffle para random yung may orbs
    const shuffled = [...boxes].sort(() => Math.random() - 0.5);
    const orbBoxes = shuffled.slice(0, orbCount);

    // pili ng ISANG tamang box
    correctIndex = boxes.indexOf(
        orbBoxes[Math.floor(Math.random() * orbBoxes.length)]
    );

    // LAGYAN LANG NG "1" ANG TAMANG ORB
    boxes[correctIndex].firstChild.textContent = "1";

    // pakita lahat ng orbs (pang-lito)
    orbBoxes.forEach(box => {
        box.firstChild.style.display = "block";
    });

    // itago ulit pagkatapos ng ilang milliseconds
    setTimeout(() => {
        orbBoxes.forEach(box => {
            box.firstChild.style.display = "none";
        });
        active = true;
        message.textContent = "Make your move.";
    }, reveal);
}

/* ===============================
   PAGPILI NG BOX
================================ */
function chooseBox(index) {
    if (!active || gameOver) return;
    active = false;

    boxes[index].classList.add("lift");

    if (index === correctIndex) {
        // TAMA
        boxes[index].firstChild.style.display = "block";
        scores[currentPlayer]++;
        message.textContent = "You chose wisely.";
    } else {
        // MALI → bawas buhay
        boxes.forEach(box => box.firstChild.style.display = "block");
        lives[currentPlayer]--;
        message.textContent = "Wrong choice. You lost a life.";
    }

    updateScores();

    // pag ubos buhay → end game
    if (lives[currentPlayer] <= 0) {
        endGame();
        return;
    }

    // lipat turn
    currentPlayer = currentPlayer === 0 ? 1 : 0;
    turnDisplay.textContent = `Turn: Player ${currentPlayer + 1}`;
}

/* ===============================
   UPDATE SCORE + LIVES
================================ */
function updateScores() {
    p1Score.textContent = `Player 1: ${scores[0]} | ${"❤️".repeat(lives[0])}`;
    p2Score.textContent = `Player 2: ${scores[1]} | ${"❤️".repeat(lives[1])}`;
}

/* ===============================
   TIMER
================================ */
function startTimer() {
    stopTimer();
    timerInterval = setInterval(() => {
        timeRemaining--;
        updateTimerDisplay();
        if (timeRemaining <= 0) endGame();
    }, 1000);
}

function stopTimer() {
    clearInterval(timerInterval);
}

function updateTimerDisplay() {
    const min = Math.floor(timeRemaining / 60);
    const sec = timeRemaining % 60;
    timerDisplay.textContent = `Time: ${min}:${sec.toString().padStart(2, "0")}`;
}

/* ===============================
   END GAME
================================ */
function endGame() {
    gameOver = true;
    stopTimer();

    const winner =
        lives[0] <= 0 ? "Player 2" :
        lives[1] <= 0 ? "Player 1" :
        scores[0] > scores[1] ? "Player 1" : "Player 2";

    winnerText.textContent = `🏆 ${winner} WINS THE RITUAL 🏆`;
    winnerOverlay.style.display = "flex";
}

function closeOverlay() {
    winnerOverlay.style.display = "none";
}

/* ===============================
   EVENT LISTENER
================================ */
roundBtn.addEventListener("click", startRound);
