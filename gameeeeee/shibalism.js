const container = document.getElementById("gameContainer");
const info = document.getElementById("info");

let mode = null;
let gameActive = false;
let timer, timeLeft;

// ================= MAZES =================
const easyMazes = [
  [
    [1,1,1,1,1,1,1,1],
    [1,0,0,1,0,0,0,1],
    [1,0,1,1,0,1,0,1],
    [1,0,0,0,0,1,0,1],
    [1,1,0,1,0,0,0,1],
    [1,0,0,1,0,1,0,1],
    [1,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,1],
  ],
  [
    [1,1,1,1,1,1,1,1],
    [1,0,1,0,0,0,0,1],
    [1,0,1,1,1,0,1,1],
    [1,0,0,0,1,0,0,1],
    [1,1,0,1,0,0,0,1],
    [1,0,0,1,0,1,0,1],
    [1,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,1],
  ]
];

const hardMazes = [
  [
    [1,1,1,1,1,1,1,1],
    [1,0,1,0,0,1,0,1],
    [1,0,1,0,1,0,1,1],
    [1,0,0,0,1,0,0,1],
    [1,1,1,0,1,1,0,1],
    [1,0,0,0,0,1,0,1],
    [1,0,1,1,0,0,0,1],
    [1,1,1,1,1,1,1,1],
  ],
  [
    [1,1,1,1,1,1,1,1],
    [1,0,0,1,0,0,0,1],
    [1,0,1,1,0,1,0,1],
    [1,0,1,0,0,1,0,1],
    [1,0,1,0,1,1,0,1],
    [1,0,0,0,1,0,0,1],
    [1,1,1,0,0,0,0,1],
    [1,1,1,1,1,1,1,1],
  ]
];

const finish = { x: 6, y: 6 };

// ================= SOLO =================
let maze, player;

function startSolo(diff) {
  clearInterval(timer);
  container.className = "solo";
  mode = "solo";

  maze = (diff === "easy" ? easyMazes : hardMazes)
    [Math.floor(Math.random() * 2)];

  player = { x: 1, y: 1 };
  timeLeft = diff === "easy" ? 120 : 300;
  gameActive = true;

  drawSolo();
  timer = setInterval(updateTimer, 1000);
}

function drawSolo() {
  container.innerHTML = "";
  for (let y=0;y<8;y++) {
    for (let x=0;x<8;x++) {
      const c = document.createElement("div");
      c.className = "cell " + (maze[y][x] ? "wall" : "path");
      if (player.x===x && player.y===y) c.classList.add("player1");
      if (x===finish.x && y===finish.y) c.classList.add("finish");
      container.appendChild(c);
    }
  }
}

// ================= DUAL =================
let maze1, maze2, p1, p2;

function startDual() {
  clearInterval(timer);
  container.className = "dual";
  mode = "dual";
  gameActive = true;

  maze1 = hardMazes[Math.floor(Math.random()*2)];
  maze2 = hardMazes[Math.floor(Math.random()*2)];
  p1 = {x:1,y:1};
  p2 = {x:1,y:1};

  drawDual();
}

function drawDual() {
  container.innerHTML="";
  for (let y=0;y<8;y++) {
    for (let m=0;m<2;m++) {
      const mz = m===0?maze1:maze2;
      const p = m===0?p1:p2;
      for (let x=0;x<8;x++) {
        const c=document.createElement("div");
        c.className="cell "+(mz[y][x]?"wall":"path");
        if (p.x===x && p.y===y)
          c.classList.add(m===0?"player1":"player2");
        if (x===finish.x && y===finish.y)
          c.classList.add("finish");
        container.appendChild(c);
      }
    }
  }
}

// ================= INPUT =================
document.addEventListener("keydown", e=>{
  if (!gameActive) return;

  if (mode==="solo") {
    move(player, maze, e.key, true);
    drawSolo();
    if (player.x===finish.x && player.y===finish.y) win("You");
  }

  if (mode==="dual") {
    move(p1, maze1, e.key, false, "Arrow");
    move(p2, maze2, e.key.toLowerCase(), false, "wasd");
    drawDual();
    if (p1.x===finish.x && p1.y===finish.y) win("Player 1");
    if (p2.x===finish.x && p2.y===finish.y) win("Player 2");
  }
});

function move(p, mz, key, solo, type="") {
  let dx=0,dy=0;
  if (key==="ArrowUp"||key==="w") dy--;
  if (key==="ArrowDown"||key==="s") dy++;
  if (key==="ArrowLeft"||key==="a") dx--;
  if (key==="ArrowRight"||key==="d") dx++;
  if (mz[p.y+dy]?.[p.x+dx]===0) { p.x+=dx; p.y+=dy; }
}

// ================= TIMER & WIN =================
function updateTimer() {
  timeLeft--;
  info.textContent = `Time: ${timeLeft}s`;
  if (timeLeft<=0) win("No one");
}

function win(who) {
  clearInterval(timer);
  gameActive=false;
  alert(`${who} wins!`);
}

// ================= BUTTONS =================
soloBtn.onclick=()=>soloOptions.style.display="block";
easyBtn.onclick=()=>startSolo("easy");
hardBtn.onclick=()=>startSolo("hard");
dualBtn.onclick=startDual;

