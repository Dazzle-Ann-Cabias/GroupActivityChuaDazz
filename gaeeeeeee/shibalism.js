 
 /* nagpatulong sa ai pero ang daming extra code na hindi naman pinapakita sa program haysttttttttt */
 
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

/* copy paste sa mga lecture */

    let boxes = [];
    let correctIndex = -1;
    let active = false;

    let scores = [0, 0];
    let currentPlayer = 0;
    let firstRound = true;
    let gameOver = false;
    let timerInterval = null;
    let timeRemaining = 300; // 5 minutes in seconds

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
        stopTimer();
        timeRemaining = 300;
        updateTimerDisplay();
    }

    function setupArena(count, cols) {
        arena.innerHTML = "";
        arena.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
        boxes = [];
 /* merong for kasi linagay ni AI trinay kong palitan ng if, else kaso iba daw yun sa for.....(T-T) */
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
            startTimer();
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
/* ang pangit nung animation halatang copy paste lang sa w3 */
        boxes[i].classList.add("lift");

        if (i === correctIndex) {
            boxes[i].firstChild.style.display = "block";
            scores[currentPlayer]++;
            message.textContent = "Correct.";
        } else {
            boxes.forEach(b => b.firstChild.style.display = "block");
            message.textContent = "Wrong.";
        }
/* copy na naman sa lectures yung if elseeeee */
        updateScores();

        if (scores[currentPlayer] >= 5) {
            // fakeeeee hindi sya nag o-overlay nagpapatulong na sa AI hindi pa rin na aayos 8080 lang ata ako mag prompt
            gameOver = true;
            const p1Name = document.getElementById("p1Name").value || "Player 1";
            const p2Name = document.getElementById("p2Name").value || "Player 2";
            const winner = currentPlayer === 0 ? p1Name : p2Name;
            winnerText.textContent = `${winner.toUpperCase()} WINS THE RITUAL!`;
            winnerOverlay.style.display = "flex";
            roundBtn.disabled = true;
            return;
        }

        // function pag magpapalit na ng player sa gameeeee
        currentPlayer = currentPlayer ? 0 : 1;
        turnDisplay.textContent = `Turn: ${currentPlayer === 0 ? document.getElementById("p1Name").value || "Player 1" : document.getElementById("p2Name").value || "Player 2"}`;
    }

    /* function sa scoreboard hayst sayang walang timer */
    function updateScores() {
        const p1Name = document.getElementById("p1Name").value || "Player 1";
        const p2Name = document.getElementById("p2Name").value || "Player 2";
        p1Score.textContent = `${p1Name}: ${scores[0]}`;
        p2Score.textContent = `${p2Name}: ${scores[1]}`;
    }

    // Timer function - 5 minute countdown
    function startTimer() {
        if (timerInterval) clearInterval(timerInterval);
        
        timerInterval = setInterval(() => {
            timeRemaining--;
            updateTimerDisplay();
            
            if (timeRemaining <= 0) {
                stopTimer();
                endGame();
            }
        }, 1000);
    }
/* yesssss nag palagay sa co-pilot ng timerrrrrr pero set na sya sa 5 minutes hayst */
    function stopTimer() {
        if (timerInterval) {
            clearInterval(timerInterval);
            timerInterval = null;
        }
    }

    function updateTimerDisplay() {
        const minutes = Math.floor(timeRemaining / 60);
        const seconds = timeRemaining % 60;
        const timerDisplay = document.getElementById("timer");
        if (timerDisplay) {
            timerDisplay.textContent = `Time: ${minutes}:${seconds.toString().padStart(2, '0')}`;
        }
    }

    function endGame() {
        gameOver = true;
        active = false;
        const p1Name = document.getElementById("p1Name").value || "Player 1";
        const p2Name = document.getElementById("p2Name").value || "Player 2";
        const winner = scores[0] > scores[1] ? p1Name : scores[1] > scores[0] ? p2Name : "TIE";
        winnerText.textContent = `TIME'S UP! ${winner.toUpperCase()} WINS!`;
        winnerOverlay.style.display = "flex";
        roundBtn.disabled = true;
    }

    function closeOverlay() {
        winnerOverlay.style.display = "none";
    }




