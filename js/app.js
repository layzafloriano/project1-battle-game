/* eslint-disable no-use-before-define */
/* eslint-disable default-case */
/* eslint-disable react/no-multi-comp */

// Inicial config
const canvasBoard = document.getElementById('game-area');
let arrBullets = [];

const myGameArea = {
  frames: 0,
  canvas: document.createElement('canvas'),
  start() {
    this.canvas.width = 500;
    this.canvas.height = 500;
    this.context = this.canvas.getContext('2d');
    canvasBoard.insertBefore(this.canvas, canvasBoard.childNodes[3]);
    this.interval = setInterval(updateGameArea, 20);
    this.intervalChron = setInterval(chronometer, 1000);
  },
  clear() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  },
  stop() {
    clearInterval(this.interval);
  },
  score() {
    myGameArea.context.font = '18px arial';
    myGameArea.context.fillStyle = 'white';
    myGameArea.context.fillText(`time: ${minutes}:${seconds}`, 400, 40);
  },
};

// Tank player
class Component {
  constructor(width, height, x, y) {
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.speedX = 0;
    this.speedY = 0;
    this.imageId = 'tank-player-down';
    this.sideTank = 'down';
  }

  // draw tank
  update() {
    const img = document.getElementById(this.imageId);
    myGameArea.context.drawImage(img, this.x, this.y, this.width, this.height);
  }

  // change position
  newPos() {
    if (this.x + this.speedX > 0 && this.x + this.speedX < 470) {
      this.x += this.speedX;
    }
    if (this.y + this.speedY > 0 && this.y + this.speedY < 470) {
      this.y += this.speedY;
    }
  }

  left() { // limit left player
    return this.x;
  }

  right() { // limit right player
    return this.x + this.width;
  }

  top() { // limit top player
    return this.y;
  }

  bottom() { // limit bottom player
    return this.y + this.height;
  }

  crashWithEnemy(enemyTank) {
    return !(
      this.bottom() < enemyTank.top() ||
      this.top() > enemyTank.bottom() ||
      this.right() < enemyTank.left() ||
      this.left() > enemyTank.right()
    );
  }

  crashWithWall(wall) {
    return !(
      this.bottom() < wall.top() ||
      this.top() > wall.bottom() ||
      this.right() < wall.left() ||
      this.left() > wall.right()
    );
  }

  shoot() {
    if (!shooting) {
      shooting = true;
      arrBullets.push(new Bullet(6, 6, this.x, this.y));
    }
  }
}

class TankEnemy extends Component {
  constructor(width, height, x, y, positionSteps) {
    super(width, height, x, y, positionSteps);
    this.speedX = 0;
    this.speedY = 0;
    this.imageId = 'tank-enemy-down';
    this.posSteps = positionSteps;
    this.posIndex = 0;
    this.health = 5;
  }

  // draw tank enemy
  update() {
    const img = document.getElementById(this.imageId);
    myGameArea.context.drawImage(img, this.x, this.y, this.width, this.height);
  }

  posGenerator() {
    const posSelec = this.posSteps[this.posIndex];
    this.posIndex = this.posIndex < this.posSteps.length ? this.posIndex + 1 : 0;
    this.speedX = 0;
    this.speedY = 0;
    switch (posSelec) {
      case 'x+1':
        this.imageId = 'tank-enemy-right';
        this.speedX += 1;
        break;
      case 'x-1':
        this.imageId = 'tank-enemy-left';
        this.speedX -= 1;
        break;
      case 'y+1':
        this.imageId = 'tank-enemy-down';
        this.speedY += 1;
        break;
      case 'y-1':
        this.imageId = 'tank-enemy-up';
        this.speedY -= 1;
        break;
    }
  }
}

class Wall extends Component {
  update() {
    const img = document.getElementById('wall');
    myGameArea.context.drawImage(img, this.x, this.y, this.width, this.height);
  }
}

class Bullet extends Component {
  constructor(width, height, x, y) {
    super(width, height, x, y);
    this.speedX = 15;
    this.speedY = 15;
  }

  // draw bullet
  update() {
    let coordX;
    let coordY;
    let imageId;
    switch (tank.sideTank) {
      case 'up':
        coordX = this.x + 12;
        coordY = this.y;
        imageId = 'bullet-up';
        break;
      case 'down':
        coordX = this.x + 12;
        coordY = this.y + tank.height;
        imageId = 'bullet-down';
        break;
      case 'left':
        coordX = this.x;
        coordY = this.y + 12;
        imageId = 'bullet-left';
        break;
      case 'right':
        coordX = this.x + 12;
        coordY = this.y + 12;
        imageId = 'bullet-right';
    }
    const img = document.getElementById(imageId);
    myGameArea.context.drawImage(img, coordX, coordY, this.width, this.height);
  }

  newPos() {
    if (shooting) {
      switch (tank.sideTank) {
        case 'up':
          this.y -= this.speedY;
          break;
        case 'down':
          this.y += this.speedY;
          break;
        case 'left':
          this.x -= this.speedX;
          break;
        case 'right':
          this.x += this.speedX;
          break;
      }
    }
  }

  crashWithEnemy(enemyTank) {
    return !(
      this.bottom() < enemyTank.top() ||
      this.top() > enemyTank.bottom() ||
      this.right() < enemyTank.left() ||
      this.left() > enemyTank.right()
    );
  }

  crashWithCanvas() {
    if (this.x > 500 || this.x < 0 || this.y > 500 || this.y < 0) {
      shooting = false;
      arrBullets = [];
    }
  }
}

let shooting = false;

// Player
const tank = new Component(30, 30, 180, 5);

// Position Steps

const posStepsA = ['x+1', 'x+1', 'x+1', 'x+1', 'x+1', 'x+1', 'x+1', 'x+1', 'x+1', 'x+1', 'x+1', 'y+1', 'y+1', 'y+1', 'y+1', 'y+1', 'y+1', 'y+1', 'y+1', 'y+1', 'y+1', 'y+1', 'y+1', 'y+1', 'y+1', 'y+1', 'y+1', 'y+1', 'y+1', 'y+1', 'y+1', 'y+1', 'y+1', 'y+1', 'x+1', 'x+1', 'x+1', 'x+1', 'x+1', 'x+1', 'y-1', 'y-1', 'y-1', 'y-1', 'y-1', 'y-1', 'y-1', 'y-1', 'y-1', 'y-1', 'y-1', 'y-1', 'y-1', 'y-1', 'y-1', 'y-1', 'y-1', 'y-1', 'y-1', 'y-1', 'y-1', 'y-1', 'y-1', 'x-1', 'x-1', 'x-1', 'x-1', 'x-1', 'x-1', 'x-1', 'x-1', 'x-1', 'x-1', 'x-1', 'x-1', 'x-1', 'x-1', 'x-1', 'x-1', 'x-1'];

const posStepsB = ['x+1', 'x+1', 'x+1', 'x+1', 'x+1', 'x+1', 'x+1', 'x+1', 'x+1', 'x+1', 'x+1', 'y+1', 'y+1', 'y+1', 'y+1', 'y+1', 'y+1', 'y+1', 'y+1', 'y+1', 'y+1', 'y+1', 'x-1', 'x-1', 'x-1', 'x-1', 'x-1', 'x-1', 'x-1', 'x-1', 'x-1', 'x-1', 'x-1', 'x-1', 'x-1', 'x-1', 'x-1', 'x-1', 'x-1', 'y-1', 'y-1', 'y-1', 'y-1', 'y-1', 'y-1', 'y-1', 'y-1', 'y-1', 'y-1', 'y-1', 'x+1', 'x+1', 'x+1', 'x+1', 'x+1', 'x+1'];

const posStepsC = ['x-1', 'x-1', 'x-1', 'x-1', 'x-1', 'x-1', 'x-1', 'x-1', 'x-1', 'x-1', 'x-1', 'x-1', 'x-1', 'x-1', 'x-1', 'x-1', 'x-1', 'y+1', 'y+1', 'y+1', 'y+1', 'y+1', 'y+1', 'y+1', 'y+1', 'y+1', 'y+1', 'y+1', 'y+1', 'y+1', 'y+1', 'y+1', 'y+1', 'y+1', 'y+1', 'y+1', 'y+1', 'y+1', 'y+1', 'x-1', 'x-1', 'x-1', 'x-1', 'x-1', 'y-1', 'y-1', 'y-1', 'y-1', 'y-1', 'y-1', 'y-1', 'y-1', 'y-1', 'y-1', 'y-1', 'y-1', 'y-1', 'y-1', 'y-1', 'y-1', 'y-1', 'y-1', 'y-1', 'y-1', 'y-1', 'y-1', 'x+1', 'x+1', 'x+1', 'x+1', 'x+1', 'x+1', 'x+1', 'x+1', 'x+1', 'x+1', 'x+1', 'x+1', 'x+1', 'x+1', 'x+1', 'x+1', 'x+1', 'x+1', 'x+1', 'x+1', 'x+1', 'x+1'];

const posStepsD = ['y-1', 'y-1', 'y-1', 'y-1', 'y-1', 'y-1', 'y-1', 'y-1', 'y-1', 'y-1', 'y-1', 'x-1', 'x-1', 'x-1', 'x-1', 'x-1', 'x-1', 'x-1', 'x-1', 'x-1', 'x-1', 'x-1', 'y-1', 'y-1', 'y-1', 'y-1', 'y-1', 'y-1', 'y-1', 'y-1', 'y-1', 'y-1', 'y-1', 'x+1', 'x+1', 'x+1', 'x+1', 'x+1', 'x+1', 'x+1', 'x+1', 'x+1', 'x+1', 'x+1', 'y+1', 'y+1', 'y+1', 'y+1', 'y+1', 'y+1', 'y+1', 'y+1', 'y+1', 'y+1', 'y+1', 'y+1', 'y+1', 'y+1', 'y+1', 'y+1', 'y+1', 'y+1', 'y+1', 'y+1', 'y+1'];

const posStepsE = ['x+1', 'x+1', 'x+1', 'x+1', 'x+1', 'x+1', 'x+1', 'x+1', 'y-1', 'y-1', 'y-1', 'y-1', 'y-1', 'y-1', 'y-1', 'y-1', 'y-1', 'y-1', 'y-1', 'y-1', 'y-1', 'y-1', 'y-1', 'y-1', 'y-1', 'y-1', 'y-1', 'y-1', 'y-1', 'y-1', 'x-1', 'x-1', 'x-1', 'x-1', 'x-1', 'x-1', 'y+1', 'y+1', 'y+1', 'y+1', 'y+1', 'y+1', 'y+1', 'y+1', 'y+1', 'y+1', 'y+1', 'y+1', 'y+1', 'y+1', 'y+1', 'y+1', 'y+1', 'y+1', 'y+1', 'y+1', 'y+1', 'y+1', 'x-1', 'x-1'];

const posStepsF = ['y-1', 'y-1', 'y-1', 'y-1', 'y-1', 'y-1', 'y-1', 'y-1', 'x+1', 'x+1', 'x+1', 'x+1', 'x+1', 'x+1', 'x+1', 'x+1', 'x+1', 'x+1', 'x+1', 'x+1', 'x+1', 'x+1', 'x+1', 'x+1', 'x+1', 'y-1', 'y-1', 'y-1', 'y-1', 'y-1', 'y-1', 'y-1', 'y-1', 'y-1', 'y-1', 'y-1', 'x-1', 'x-1', 'x-1', 'x-1', 'x-1', 'x-1', 'x-1', 'x-1', 'x-1', 'x-1', 'x-1', 'y+1', 'y+1', 'y+1', 'y+1', 'y+1', 'y+1', 'y+1', 'y+1', 'y+1', 'y+1', 'y+1', 'y+1', 'y+1', 'y+1', 'y+1', 'y+1', 'y+1', 'y+1', 'y+1', 'y+1', 'y+1', 'y+1', 'x-1', 'x-1', 'x-1', 'x-1', 'x-1', 'x-1', 'y-1', 'y-1', 'y-1'];

// Enemies
const tankEnemy1 = new TankEnemy(30, 30, 15, 10, posStepsA);
const tankEnemy2 = new TankEnemy(30, 30, 240, 240, posStepsB);
const tankEnemy3 = new TankEnemy(30, 30, 450, 10, posStepsC);
const tankEnemy4 = new TankEnemy(30, 30, 235, 460, posStepsD);
const tankEnemy5 = new TankEnemy(30, 30, 300, 460, posStepsE);
const tankEnemy6 = new TankEnemy(30, 30, 10, 400, posStepsF);

const arrEnemies = [tankEnemy1, tankEnemy2, tankEnemy3, tankEnemy4, tankEnemy5, tankEnemy6];

// Map

const wall1 = new Wall(50, 160, 60, 50);
const wall2 = new Wall(50, 160, 170, 50);
const wall3 = new Wall(50, 160, 280, 50);
const wall4 = new Wall(50, 160, 390, 50);
const wall5 = new Wall(50, 160, 60, 290);
const wall6 = new Wall(50, 160, 170, 290);
const wall7 = new Wall(50, 160, 280, 290);
const wall8 = new Wall(50, 160, 370, 290);


const arrWalls = [wall1, wall2, wall3, wall4, wall5, wall6, wall7, wall8];


const checkEnemyDowned = () => {
  let crashedEnemy;
  let index;
  arrBullets.forEach((bullet) => {
    crashedEnemy = arrEnemies.some((enemyTank, idx) => {
      if (bullet.crashWithEnemy(enemyTank)) {
        index = idx;
        return true;
      }
      return false;
    });
  });
  if (crashedEnemy) {
    const shotAudio = document.getElementById('shotAudio');
    shotAudio.play();
    shooting = false;
    arrBullets = [];
    shooting = false;
    arrEnemies[index].health -= 1;
    if (arrEnemies[index].health <= 0) {
      arrEnemies.splice(index, 1);
    }
  }
};

const checkGameOver = () => {
  const crashedEnemy = arrEnemies.some(enemyTank => tank.crashWithEnemy(enemyTank));
  const crashedWall = arrWalls.some(wall => tank.crashWithWall(wall));
  if (crashedEnemy || crashedWall) {
    const gameOverAudio = document.getElementById('gameOverAudio');
    gameOverAudio.play();
    myGameArea.stop();
    const img = document.getElementById('game-over');
    myGameArea.context.drawImage(img, 150, 150, 200, 200);
  }
};

const checkWin = () => {
  if (arrEnemies.length <= 0) {
    myGameArea.stop();
    const img = document.getElementById('you-win');
    myGameArea.context.drawImage(img, 160, 170, 150, 160);
    const winAudio = document.getElementById('winAudio');
    winAudio.play();
  }
};

let seconds = 0;
let minutes = 0;

const chronometer = () => {
  seconds += 1;
  if (seconds > 59) {
    seconds = 0;
    minutes += 1;
  }
};

const updateGameArea = () => {
  myGameArea.frames += 1;
  myGameArea.clear();
  tank.newPos();
  tank.update();

  if (myGameArea.frames % 20 === 0) {
    arrEnemies.forEach((enemy) => {
      enemy.posGenerator();
    });
  }
  arrEnemies.forEach((enemy) => {
    enemy.newPos();
    enemy.update();
  });

  arrWalls.forEach((wall) => {
    wall.update();
  });

  arrBullets.forEach((bullet) => {
    bullet.crashWithCanvas();
    bullet.update();
    bullet.newPos();
  });
  myGameArea.score();
  checkEnemyDowned();
  checkGameOver();
  checkWin();
};

document.onkeydown = (e) => {
  switch (e.keyCode) {
    case 38: // up arrow
      tank.imageId = 'tank-player-up';
      tank.speedY -= 1;
      tank.sideTank = 'up';
      break;
    case 40: // down arrow
      tank.imageId = 'tank-player-down';
      tank.speedY += 1;
      tank.sideTank = 'down';
      break;
    case 37: // left arrow
      tank.imageId = 'tank-player-left';
      tank.speedX -= 1;
      tank.sideTank = 'left';
      break;
    case 39: // right arrow
      tank.imageId = 'tank-player-right';
      tank.speedX += 1;
      tank.sideTank = 'right';
      break;
    case 32:
      tank.shoot();
  }
};

document.onkeyup = () => {
  tank.speedX = 0;
  tank.speedY = 0;
};


const autoStart = () => {
  if (document.location.hash === '#start') {
    myGameArea.start();
  }
};

window.onload = () => {
  autoStart();
};

document.getElementById('start-button').onclick = () => {
  if (document.location.hash !== '#start') {
    document.location.href = `${document.location}#start`;
  }
  document.location.reload(true);
};
