// ===========================================
// ==========ELEMENT REFERENCES===============
// ===========================================

const home = document.getElementById("home");
const game = document.getElementById("game");
const arena = document.getElementById("arena");
const message = document.getElementById("message");
const p1Score = document.getElementById("p1Score");
const p2Score = document.getElementById("p2Score");
const turnDisplay = document.getElementById("turn");
const timerDisplay = document.getElementById("timer");
const winnerOverlay = document.getElementById("winnerOverlay");
const winnerText = document.getElementById("winnerText");
const difficultySelect = document.getElementById("difficulty");
const howToOverlay = document.getElementById("howToOverlay");
const p1NameInput = document.getElementById("p1Name");
const p2NameInput = document.getElementById("p2Name");

// ==============================
// =====GAME SETTINGS/STATES=====
// ==============================

let playerMode = "dual";
let boxes = [];
let correctIndex = -1;
let active = false;
let lives = [3,3];
let points = [0,0];
let currentPlayer = 0;
let firstRound = true;
let gameOver = false;
let timerInterval = null;
let autoRoundTimeout = null;
let timeRemaining = 120;
let extremeSequence = [];
const POINTS_TO_WIN = 5;

// ===================================
// ==========GAME FUNCTIONS===========
// ===================================

function setMode(mode){
    playerMode = mode;
    home.style.display = "none";
    game.style.display = "flex";

    if(playerMode === "single"){
        p2NameInput.style.display = "none";
    } else {
        p2NameInput.style.display = "inline-block";
    }
    restartGame();
}
function backToHome(){ 
    restartGame(); 
    game.style.display="none"; 
    home.style.display="flex"; 
}
function openHowTo(){ howToOverlay.style.display="flex"; }
function closeHowTo(){ howToOverlay.style.display="none"; }
function difficultyChanged(){ restartGame(); }

// ===================================
// ===========ARENA SETUP=============
// ===================================

function setupArena(count, cols){
    arena.innerHTML="";
    arena.style.gridTemplateColumns=`repeat(${cols},1fr)`;
    boxes=[];
    for(let i=0;i<count;i++){
        const box=document.createElement("div");
        box.className="box";
        const orb=document.createElement("div");
        orb.className="orb";
        orb.style.background=`radial-gradient(circle at 30% 30%, ${getRandomColor()}, #333)`;
        box.appendChild(orb);
        box.onclick=()=>{ 
            if(difficultySelect.value==="extreme") handleExtremeClick(i); 
            else chooseBox(i); 
        };
        arena.appendChild(box);
        boxes.push(box);
    }
}

function getRandomColor(){
    const colors=["#ff3c3c","#3cff3c","#3c3cff","#ff3cff","#ffb03c","#3cffb0","#b03cff","#fff33c"];
    return colors[Math.floor(Math.random()*colors.length)];
}

// ===============================================
// ========SCORE, TIMER AND LIVES/HEARTS==========
// ===============================================

function updateScores(){
    p1Score.innerHTML = `<div class="score-number">${points[0]}</div>` + '❤️'.repeat(lives[0]);
    p2Score.innerHTML = `<div class="score-number">${points[1]}</div>` + '❤️'.repeat(lives[1]);

    if(playerMode === "single") p2Score.style.display = "none";
    else p2Score.style.display = "block";
}

function startTimer(){
    stopTimer();
    timerInterval=setInterval(()=>{
        timeRemaining--;
        updateTimerDisplay();
        if(timeRemaining <= 0) endGame();
    },1000);
}

function stopTimer(){ 
    if(timerInterval){clearInterval(timerInterval); timerInterval=null;} 
}

function updateTimerDisplay(){ 
    const min=Math.floor(timeRemaining/60); 
    const sec=timeRemaining%60; 
    timerDisplay.textContent=`Time: ${min}:${sec.toString().padStart(2,"0")}`; 
}

function stopAutoRounds(){ 
    if(autoRoundTimeout) clearTimeout(autoRoundTimeout); 
}

// ===========================================
// ============AND GAME DISPLAY===============
// ===========================================

function endGame(winnerPlayer=null){
    gameOver=true;
    stopTimer(); 
    stopAutoRounds();

    let winnerName;

    if(playerMode === "single"){
        winnerName = p1NameInput.value || "Player 1";
        if(lives[0] <= 0 || timeRemaining <= 0){
            winnerText.textContent = `💀 ${winnerName} -10000000 AURO POINTS 💀`;
        } else {
            winnerText.textContent = `🏆 ${winnerName} TSK SIGMAAAAAA 🏆`;
        }
    } else {
        if(!winnerPlayer){
            if(lives[0] > lives[1]) winnerPlayer=1;
            else if(lives[1] > lives[0]) winnerPlayer=2;
            else { winnerText.textContent = "✨ OPPS TIED! ✨"; winnerOverlay.style.display="flex"; return; }
        }
        winnerName = winnerPlayer === 1 ? (p1NameInput.value || "Player 1") : (p2NameInput.value || "Player 2");
        winnerText.textContent = `🏆 ${winnerName} TSK SIGMAAAAAA! 🏆`;
    }

    winnerOverlay.style.display="flex";
}

/* ===== CLOSE WINNER OVERLAY ===== */
function closeOverlay(){ winnerOverlay.style.display="none"; }

/* ===== RESTART GAME ===== */
function restartGame(){
    stopTimer(); stopAutoRounds();
    lives=[3,3]; points=[0,0]; currentPlayer=0; firstRound=true; gameOver=false;
    arena.innerHTML=""; message.textContent="The ritual begins."; winnerOverlay.style.display="none";
    timeRemaining=120; updateScores(); updateTimerDisplay();
    startRound();
}

/* ===== START ROUND ===== */
function startRound(){
    if(gameOver) return;
    if(firstRound){ startTimer(); firstRound=false; }

    const diff=difficultySelect.value;
    if(diff==="extreme"){ setupExtreme(); return; }

    const boxCount=diff==="hard"?20:10;
    const reveal=diff==="hard"?500:1000;
    setupArena(boxCount,5);

    active=false;
    let newCorrect;
    do{ newCorrect=Math.floor(Math.random()*boxes.length);}while(newCorrect===correctIndex);
    correctIndex=newCorrect;

    boxes.forEach(box=>{
        const orb=box.firstChild; 
        orb.style.display="block"; 
        orb.textContent=""; 
        orb.style.fontSize="0px"; 
        orb.classList.remove("pop");
    });
    boxes[correctIndex].firstChild.textContent="1";
    boxes[correctIndex].firstChild.style.fontSize="14px"; 
    boxes[correctIndex].firstChild.style.color="#fff";

    setTimeout(()=>{
        boxes.forEach(box=>box.firstChild.style.display="none");
        active=true;
        turnDisplay.textContent = playerMode==="single" ? (p1NameInput.value || "Player 1") : "Player "+(currentPlayer+1);
        message.textContent=`Player ${currentPlayer+1}, make your move.`;
    },reveal);
}

/* ===== CHOOSING BOX ===== */
function chooseBox(index){
    if(!active||gameOver) return;

    active=false;
    const orb=boxes[index].firstChild; 
    orb.style.display="block"; 
    orb.classList.add("pop");

    if(index!==correctIndex){
        lives[currentPlayer]--;
        message.textContent=`Wrong! ${playerMode==="single"? (p1NameInput.value || "Player 1") : "Player "+(currentPlayer+1)} loses a life.`;
        updateScores();
        if(lives[currentPlayer]<=0){ endGame(); return; }
    } else {
        points[currentPlayer]++;
        updateScores();
        message.textContent=`Correct!`;

        if(points[currentPlayer]>=POINTS_TO_WIN){ endGame(currentPlayer+1); return; }
    }

    if(playerMode==="single"){
        currentPlayer=0;
        turnDisplay.textContent=`Turn: ${p1NameInput.value || "Player 1"}`;
    } else {
        currentPlayer = currentPlayer===0?1:0;
        turnDisplay.textContent=`Turn: ${currentPlayer===0? (p1NameInput.value || "Player 1") : (p2NameInput.value || "Player 2")}`;
    }

    autoRoundTimeout=setTimeout(()=> startRound(),800);
}

/* ===== EXTREME MODE ===== */
function setupExtreme(){
    const count=50; const cols=10; setupArena(count,cols);
    active=false; extremeSequence=[];

    let usedIndices=[];

    for(let i=1;i<=10;i++){
        let idx; do{ idx=Math.floor(Math.random()*boxes.length);}while(usedIndices.includes(idx));
        usedIndices.push(idx);

        const orbBox = boxes[idx];
        extremeSequence.push({box: orbBox, num:i, clicked:false});

        const orb=orbBox.firstChild;
        orb.style.display="block"; orb.textContent=i; orb.style.fontSize="14px"; orb.style.color="#fff";
    }

    setTimeout(()=>{ 
        boxes.forEach(box=>box.firstChild.style.display="none"); 
        active=true;
        turnDisplay.textContent = playerMode==="single" ? (p1NameInput.value || "Player 1") : "Player "+(currentPlayer+1);
        message.textContent = `Click all numbered orbs to complete the sequence.`;
    },4000);
}

function handleExtremeClick(idx){
    if(!active || gameOver) return;

    const clickedBox = boxes[idx];
    const orb = clickedBox.firstChild;
    orb.style.display = "block"; 
    orb.classList.add("pop");

    const seqObj = extremeSequence.find(e => e.box === clickedBox);

    if(seqObj){ 
        if(!seqObj.clicked){
            seqObj.clicked = true;
            points[currentPlayer]++;
            updateScores();
            message.textContent = `Correct orb!`;
        } else {
            message.textContent = `You already clicked this orb.`;
        }
    } else {
        lives[currentPlayer]--;
        updateScores();
        message.textContent = `Wrong click! You lose a life.`;
        if(lives[currentPlayer] <= 0){ 
            if(playerMode === "single"){
                endGame(); 
            } else {
                const otherPlayer = currentPlayer === 0 ? 1 : 0;
                endGame(otherPlayer+1);
            }
            return; 
        }
    }

    if(extremeSequence.every(e => e.clicked)){
        message.textContent = `Player ${playerMode==="single" ? (p1NameInput.value || "Player 1") : "Player "+(currentPlayer+1)} completed all orbs!`;
        extremeSequence.forEach(e => e.clicked = false);
        autoRoundTimeout = setTimeout(() => startRound(), 1000);
        return;
    }

    if(playerMode !== "single") currentPlayer = currentPlayer === 0 ? 1 : 0;
    turnDisplay.textContent = playerMode==="single" ? (p1NameInput.value || "Player 1") : "Player "+(currentPlayer+1);
}
