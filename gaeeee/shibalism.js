/* ===== DOM ELEMENTS ===== */
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

/* ===== GAME STATE ===== */
let boxes = [];
let correctIndex = -1;
let active = false;

let scores = [0, 0];
let currentPlayer = 0;

let firstRound = true;
let gameOver = false;

let timerInterval = null;
let timeRemaining = 120; // 2 minutes

/* ===== PAGE NAVIGATION ===== */
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

/* ===== GAME SETUP ===== */
function restartGame() {
    scores = [0, 0];
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

/* ===== ARENA ===== */
function setupArena(count, cols) {
    arena.innerHTML = "";
    arena.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    boxes = [];

    for (let i = 0; i < count; i++) {
        const box = document.createElement("div");
        box.className = "box";

        const orb = document.createElement("div");
        orb.className = "orb";

        box.appendChild(orb);
        box.onclick = () => chooseBox(i);

        arena.appendChild(box);
        boxes.push(box);
    }
}

/* ===== ROUND LOGIC ===== */
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

    const shuffled = [...boxes].sort(() => Math.random() - 0.5);
    const orbBoxes = shuffled.slice(0, orbCount);
    correctIndex = boxes.indexOf(
        orbBoxes[Math.floor(Math.random() * orbBoxes.length)]
    );

    orbBoxes.forEach(box => box.firstChild.style.display = "block");

    setTimeout(() => {
        orbBoxes.forEach(box => box.firstChild.style.display = "none");
        active = true;
        message.textContent = "Make your move.";
    }, reveal);
}

function chooseBox(index) {
    if (!active || gameOver) return;
    active = false;

    boxes[index].classList.add("lift");

    if (index === correctIndex) {
        boxes[index].firstChild.style.display = "block";
        scores[currentPlayer]++;
        message.textContent = "You chose wisely.";
    } else {
        boxes.forEach(box => box.firstChild.style.display = "block");
        message.textContent = "That was not the one.";
    }

    updateScores();

    if (scores[currentPlayer] >= 5) {
        endGame();
        return;
    }

    currentPlayer = currentPlayer === 0 ? 1 : 0;
    turnDisplay.textContent = `Turn: Player ${currentPlayer + 1}`;
}

/* ===== SCORE & TIMER ===== */
function updateScores() {
    p1Score.textContent = `Player 1: ${scores[0]}`;
    p2Score.textContent = `Player 2: ${scores[1]}`;
}

function startTimer() {
    stopTimer();
    timerInterval = setInterval(() => {
        timeRemaining--;
        updateTimerDisplay();
        if (timeRemaining <= 0) endGame();
    }, 1000);
}

function stopTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

function updateTimerDisplay() {
    const min = Math.floor(timeRemaining / 60);
    const sec = timeRemaining % 60;
    timerDisplay.textContent = `Time: ${min}:${sec.toString().padStart(2, "0")}`;
}

/* ===== GAME END ===== */
function endGame() {
    gameOver = true;
    stopTimer();
    winnerText.textContent = "🏆✨ RITUAL COMPLETE ✨🏆";
    winnerOverlay.style.display = "flex";
}

function closeOverlay() {
    winnerOverlay.style.display = "none";
}

roundBtn.addEventListener("click", startRound);



