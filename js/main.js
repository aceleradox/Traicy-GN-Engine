const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
ctx.imageSmoothingEnabled = false;

const elScore = document.getElementById('score');
const elCoins = document.getElementById('coins');
const elLives = document.getElementById('lives');
const overlay = document.getElementById('overlay');
const titleEl = document.getElementById('title');
const msgEl = document.getElementById('msg');
const restartBtn = document.getElementById('restart');

const GRAVITY = gameData.physics.gravity;
const SPEED = gameData.physics.speed;
const JUMP_VEL = gameData.physics.jumpVel;
const FRICTION = gameData.physics.friction;

let state = 'playing';
let score = 0;
let lives = 3;
let coinsTotal = 0;
const keys = {};

const player = {
  x: gameData.playerStart.x,
  y: gameData.playerStart.y,
  w: gameData.playerStart.w,
  h: gameData.playerStart.h,
  vx: 0,
  vy: 0,
  facing: 1,
  onGround: false,
  walkFrame: 0,
  crouching: false,
  hurtTimer: 0,
  jumpLock: false
};

let platforms = [];
let enemies = [];
let coins = [];
const clouds = [];
let t = 0;

function initGame() {
  state = 'playing';
  score = 0;
  lives = 3;
  player.x = gameData.playerStart.x;
  player.y = gameData.playerStart.y;
  player.vx = 0;
  player.vy = 0;
  player.hurtTimer = 0;
  overlay.classList.add('hidden');

  platforms = gameData.platforms.map((p) => ({ ...p }));
  enemies = gameData.enemies.map((e) => ({ ...e }));
  coins = gameData.coins.map((c) => ({ ...c }));
  coinsTotal = coins.length;

  clouds.length = 0;
  gameData.clouds.forEach((cloud) => clouds.push({ ...cloud }));

  updateHUD();
}

function updateHUD() {
  elScore.textContent = score;
  const taken = coins.filter((c) => c.taken).length;
  elCoins.textContent = `${taken}/${coinsTotal}`;
  elLives.textContent = '❤️'.repeat(Math.max(0, lives));
}

function collide(a, b) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

window.addEventListener('keydown', (e) => {
  const k = e.key;
  if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', ' ', 'w', 'W', 'a', 'A', 'd', 'D', 's', 'S'].includes(k)) e.preventDefault();
  keys[k] = true;
  if (k === ' ' || k === 'w' || k === 'W') keys.ArrowUp = true;
  if (k === 'a' || k === 'A') keys.ArrowLeft = true;
  if (k === 'd' || k === 'D') keys.ArrowRight = true;
  if (k === 's' || k === 'S') keys.ArrowDown = true;
});

window.addEventListener('keyup', (e) => {
  const k = e.key;
  keys[k] = false;
  if (k === ' ' || k === 'w' || k === 'W') keys.ArrowUp = false;
  if (k === 'a' || k === 'A') keys.ArrowLeft = false;
  if (k === 'd' || k === 'D') keys.ArrowRight = false;
  if (k === 's' || k === 'S') keys.ArrowDown = false;
});

document.querySelectorAll('.cbtn').forEach((btn) => {
  const act = btn.dataset.act;
  const press = (on) => {
    if (act === 'left') keys.ArrowLeft = on;
    if (act === 'right') keys.ArrowRight = on;
    if (act === 'jump') keys.ArrowUp = on;
    if (act === 'down') keys.ArrowDown = on;
    btn.classList.toggle('active', on);
  };
  const start = (e) => { e.preventDefault(); press(true); };
  const end = (e) => { e.preventDefault(); press(false); };
  btn.addEventListener('touchstart', start, { passive: false });
  btn.addEventListener('touchend', end, { passive: false });
  btn.addEventListener('touchcancel', end, { passive: false });
  btn.addEventListener('mousedown', start);
  btn.addEventListener('mouseup', end);
  btn.addEventListener('mouseleave', end);
});

function loop() {
  requestAnimationFrame(loop);
  t++;
  if (state === 'playing') update();
  draw();
}
loop();

function update() {
  const left = keys.ArrowLeft;
  const right = keys.ArrowRight;
  const up = keys.ArrowUp;
  const down = keys.ArrowDown;

  player.vx = 0;
  if (left) { player.vx = -SPEED; player.facing = -1; }
  if (right) { player.vx = SPEED; player.facing = 1; }
  if (down && player.onGround) player.vx *= 0.6;

  player.crouching = down && player.onGround;

  if (up && player.onGround && !player.jumpLock && !player.crouching) {
    player.vy = JUMP_VEL;
    player.onGround = false;
    player.jumpLock = true;
  }
  if (!up) player.jumpLock = false;

  player.vy += GRAVITY;

  player.x += player.vx;
  if (player.x < 0) player.x = 0;
  if (player.x + player.w > canvas.width) player.x = canvas.width - player.w;

  player.y += player.vy;
  player.onGround = false;

  const prevBottom = player.y + player.h - player.vy;
  for (const p of platforms) {
    const onTop = prevBottom <= p.y + 2 && player.y + player.h >= p.y && player.y + player.h <= p.y + 20;
    const overlapX = player.x + player.w > p.x && player.x < p.x + p.w;
    if (player.vy >= 0 && onTop && overlapX) {
      player.y = p.y - player.h;
      player.vy = 0;
      player.onGround = true;
    }
  }

  if (player.onGround && Math.abs(player.vx) > 0.1 && !player.crouching) {
    player.walkFrame += 0.25;
  } else {
    player.walkFrame = 0;
  }

  for (const e of enemies) {
    if (e.dead) continue;
    e.x += e.vx;
    if (e.x <= e.minX) { e.x = e.minX; e.vx *= -1; }
    if (e.x >= e.maxX) { e.x = e.maxX; e.vx *= -1; }
  }

  for (const c of coins) {
    if (c.taken) continue;
    const dx = (player.x + player.w / 2) - c.x;
    const dy = (player.y + player.h / 2) - c.y;
    if (Math.hypot(dx, dy) < c.r + 14) {
      c.taken = true;
      score += 50;
      updateHUD();
    }
  }

  if (player.hurtTimer > 0) player.hurtTimer--;
  for (const e of enemies) {
    if (e.dead) continue;
    if (collide(player, { x: e.x, y: e.y, w: e.w, h: e.h })) {
      const stomp = player.vy > 0 && (player.y + player.h - e.y) < 16;
      if (stomp) {
        e.dead = true;
        player.vy = JUMP_VEL * 0.6;
        score += 100;
        updateHUD();
      } else if (player.hurtTimer === 0) {
        lives--;
        player.hurtTimer = 90;
        player.vy = -8;
        player.vx = player.facing * -3;
        updateHUD();
        if (lives <= 0) {
          gameOver();
        }
      }
    }
  }

  if (player.y > canvas.height + 50) {
    lives--;
    updateHUD();
    if (lives <= 0) gameOver();
    else respawn();
  }

  const allTaken = coins.every((c) => c.taken);
  if (allTaken) win();

  for (const cl of clouds) {
    cl.x += cl.s;
    if (cl.x - cl.w > canvas.width) cl.x = -cl.w - 20;
  }
}

function respawn() {
  player.x = gameData.playerStart.x;
  player.y = gameData.playerStart.y;
  player.vx = 0;
  player.vy = 0;
  player.hurtTimer = 60;
}

function win() {
  state = 'won';
  titleEl.textContent = 'VENCEU!';
  msgEl.textContent = `Pontuação final: ${score} • Vidas: ${lives}`;
  overlay.classList.remove('hidden');
}

function gameOver() {
  state = 'gameover';
  titleEl.textContent = 'GAME OVER';
  msgEl.textContent = `Você fez ${score} pontos. Tente novamente!`;
  overlay.classList.remove('hidden');
}

restartBtn.onclick = initGame;

function draw() {
  const g = ctx.createLinearGradient(0, 0, 0, canvas.height);
  g.addColorStop(0, '#60a5fa');
  g.addColorStop(1, '#e0f2fe');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = 'rgba(255,255,255,0.9)';
  for (const cl of clouds) {
    drawCloud(cl.x, cl.y, cl.w);
  }

  ctx.fillStyle = '#fde047';
  ctx.fillRect(canvas.width - 110, 50, 60, 60);
  ctx.fillStyle = '#fef9c3';
  ctx.fillRect(canvas.width - 100, 60, 40, 40);

  for (const p of platforms) {
    ctx.fillStyle = p.y >= 400 ? '#16a34a' : '#334155';
    ctx.fillRect(p.x, p.y, p.w, p.h);
    ctx.fillStyle = p.y >= 400 ? '#22c55e' : '#475569';
    ctx.fillRect(p.x, p.y, p.w, 4);
    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.fillRect(p.x, p.y + p.h - 3, p.w, 3);
  }

  for (let i = 0; i < coins.length; i++) {
    const c = coins[i];
    if (c.taken) continue;
    const bob = Math.sin((t + i * 10) * 0.08) * 2;
    const y = c.y + bob;
    ctx.save();
    ctx.translate(c.x, y);
    ctx.fillStyle = 'rgba(250,204,21,0.3)';
    ctx.beginPath(); ctx.arc(0, 0, 14, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#facc15';
    ctx.beginPath(); ctx.arc(0, 0, c.r, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#ca8a04';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = '#a16207';
    ctx.fillRect(-3, -5, 6, 8);
    ctx.restore();
  }

  for (const e of enemies) {
    if (e.dead) continue;
    ctx.save();
    ctx.translate(e.x, e.y);
    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.fillRect(3, e.h - 2, e.w - 6, 4);
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(0, 0, e.w, e.h);
    ctx.fillStyle = '#991b1b';
    ctx.fillRect(0, 0, e.w, 4);
    ctx.fillRect(0, e.h - 4, e.w, 4);
    ctx.fillStyle = '#fff';
    ctx.fillRect(5, 6, 5, 5);
    ctx.fillRect(16, 6, 5, 5);
    ctx.fillStyle = '#111';
    ctx.fillRect(7, 8, 2, 2);
    ctx.fillRect(18, 8, 2, 2);
    ctx.fillRect(4, 5, 7, 2);
    ctx.fillRect(15, 5, 7, 2);
    ctx.restore();
  }

  const blink = player.hurtTimer > 0 && Math.floor(player.hurtTimer / 4) % 2 === 0;
  if (!blink) drawPlayer(player);

  const vg = ctx.createRadialGradient(canvas.width / 2, canvas.height / 2, 200, canvas.width / 2, canvas.height / 2, 500);
  vg.addColorStop(0, 'rgba(0,0,0,0)');
  vg.addColorStop(1, 'rgba(0,0,0,0.15)');
  ctx.fillStyle = vg;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawCloud(x, y, w) {
  ctx.beginPath();
  ctx.arc(x, y, w * 0.25, 0, Math.PI * 2);
  ctx.arc(x + w * 0.3, y - 8, w * 0.22, 0, Math.PI * 2);
  ctx.arc(x + w * 0.55, y, w * 0.28, 0, Math.PI * 2);
  ctx.arc(x + w * 0.3, y + 8, w * 0.25, 0, Math.PI * 2);
  ctx.fill();
}

function drawPlayer(p) {
  ctx.save();
  ctx.translate(Math.floor(p.x), Math.floor(p.y));

  ctx.fillStyle = 'rgba(0,0,0,0.18)';
  ctx.fillRect(4, p.h - 2, p.w - 8, 4);

  const crouch = p.crouching;
  const bodyH = crouch ? 12 : 16;
  const bodyY = crouch ? 14 : 10;
  const headY = crouch ? 2 : 0;

  ctx.fillStyle = '#1e3a8a';
  if (crouch) {
    ctx.fillRect(2, bodyY + bodyH, p.w - 4, 8);
  } else {
    const step = Math.floor(p.walkFrame) % 2;
    const leg1H = step === 0 ? 12 : 9;
    const leg2H = step === 0 ? 9 : 12;
    ctx.fillRect(2, bodyY + bodyH, 9, leg1H);
    ctx.fillRect(15, bodyY + bodyH, 9, leg2H);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(2, bodyY + bodyH + leg1H - 2, 11, 3);
    ctx.fillRect(15, bodyY + bodyH + leg2H - 2, 11, 3);
    ctx.fillStyle = '#1e3a8a';
  }

  ctx.fillStyle = '#2563eb';
  ctx.fillRect(0, bodyY, p.w, bodyH);
  ctx.fillStyle = '#60a5fa';
  ctx.fillRect(6, bodyY + 3, 14, 4);

  ctx.fillStyle = '#fcd34d';
  ctx.fillRect(-3, bodyY + 2, 5, 8);
  ctx.fillRect(p.w - 2, bodyY + 2, 5, 8);

  ctx.fillStyle = '#fcd34d';
  ctx.fillRect(3, headY, 20, 18);
  ctx.fillStyle = '#dc2626';
  ctx.fillRect(2, headY - 1, 22, 7);
  ctx.fillRect(1, headY + 2, 24, 4);

  ctx.fillStyle = '#0f172a';
  const eyeY = headY + 8;
  const offset = p.facing > 0 ? 1 : -1;
  ctx.fillRect(8 + offset, eyeY, 3, 3);
  ctx.fillRect(16 + offset, eyeY, 3, 3);
  ctx.fillStyle = '#fff';
  ctx.fillRect(9 + offset, eyeY, 1, 1);
  ctx.fillRect(17 + offset, eyeY, 1, 1);

  ctx.fillStyle = '#92400e';
  ctx.fillRect(9, headY + 13, 8, 2);
  ctx.fillRect(7, headY + 11, 12, 2);

  ctx.restore();
}

initGame();

document.addEventListener('touchmove', (e) => {
  if (e.target.closest('.cbtn, canvas')) e.preventDefault();
}, { passive: false });
