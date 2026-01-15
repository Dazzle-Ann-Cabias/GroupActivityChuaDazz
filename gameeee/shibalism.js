 const home = document.getElementById("home");
    const game = document.getElementById("game");
    const arena = document.getElementById("arena");
    const message = document.getElementById("message");
    const roundBtn = document.getElementById("roundBtn");

    const winnerOverlay = document.getElementById("winnerOverlay");
    const winnerText = document.getElementById("winnerText");

    const p1Score = document.getElementById("p1Score");
    const p2Score = document.getElementById("p2Score");
    const turnDisplay = document.getElementById("turn");

    let boxes = [];
    let correctIndex = -1;
    let active = false;

    let scores = [0, 0];
    let currentPlayer = 0;
    let firstRound = true;
    let gameOver = false;

    function enterGame() {
        home.style.display = "none";
        game.style.display = "flex";
        restartGame();
    }

    function backToHome() {
        game.style.display = "none";
        home.style.display = "flex";
    }

    function restartGame() {
        scores = [0, 0];
        currentPlayer = 0;
        updateScores();
        arena.innerHTML = "";
        message.textContent = "The ritual begins anew.";
        roundBtn.textContent = "START ROUND";
        firstRound = true;
        gameOver = false;
        roundBtn.disabled = false;
        winnerOverlay.style.display = "none";
    }

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

    function startRound() {
        if (gameOver) return;

        if (firstRound) {
            roundBtn.textContent = "NEXT ROUND";
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
        correctIndex = boxes.indexOf(orbBoxes[Math.floor(Math.random() * orbBoxes.length)]);

        orbBoxes.forEach(box => {
            const orb = box.firstChild;
            orb.style.display = "block";
            orb.textContent = boxes.indexOf(box) === correctIndex ? "1" : "";
        });

        setTimeout(() => {
            orbBoxes.forEach(b => b.firstChild.style.display = "none");
            active = true;
            message.textContent = "Choose a box.";
        }, reveal);
    }

    function chooseBox(i) {
        if (!active || gameOver) return;
        active = false;

        boxes[i].classList.add("lift");

        if (i === correctIndex) {
            boxes[i].firstChild.style.display = "block";
            scores[currentPlayer]++;
            message.textContent = "Correct.";
        } else {
            boxes.forEach(b => b.firstChild.style.display = "block");
            message.textContent = "Wrong.";
        }

        updateScores();

        if (scores[currentPlayer] >= 5) {
            // Game over - show overlay
            gameOver = true;
            const p1Name = document.getElementById("p1Name").value || "Player 1";
            const p2Name = document.getElementById("p2Name").value || "Player 2";
            const winner = currentPlayer === 0 ? p1Name : p2Name;
            winnerText.textContent = `${winner.toUpperCase()} WINS THE RITUAL!`;
            winnerOverlay.style.display = "flex";
            roundBtn.disabled = true;
            return;
        }

        // Switch player
        currentPlayer = currentPlayer ? 0 : 1;
        turnDisplay.textContent = `Turn: ${currentPlayer === 0 ? document.getElementById("p1Name").value || "Player 1" : document.getElementById("p2Name").value || "Player 2"}`;
    }

    function updateScores() {
        const p1Name = document.getElementById("p1Name").value || "Player 1";
        const p2Name = document.getElementById("p2Name").value || "Player 2";
        p1Score.textContent = `${p1Name}: ${scores[0]}`;
        p2Score.textContent = `${p2Name}: ${scores[1]}`;
    }

    function closeOverlay() {
        winnerOverlay.style.display = "none";
    }

