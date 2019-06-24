// Inicial config
const myGameArea = {
  frames: 0,
  canvas: document.createElement('canvas'),
  start() {
    this.canvas.width = 500;
    this.canvas.height = 500;
    this.context = this.canvas.getContext('2d');
    document.body.insertBefore(this.canvas, document.body.childNodes[0]);
    // eslint-disable-next-line no-use-before-define
    this.interval = setInterval(updateGameArea, 20);
  },
  clear() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  },
  stop() {
    clearInterval(this.interval);
  },
};

// Tank player
class Tank {
  constructor(width, height, x, y) {
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.speedX = 0;
    this.speedY = 0;
  }

  // draw tank
  update() {
    const img = document.getElementById('tank-player');
    myGameArea.context.drawImage(img, this.x, this.y, this.width, this.height);
  }

  // change position
  newPos() {
    if ((this.x + this.speedX > 0) && this.x + this.speedX < 470) {
      this.x += this.speedX;
    }
    if ((this.y + this.speedY > 0) && (this.y + this.speedY < 470)) {
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

  crashWith(enemyTank) {
    return !(
      this.bottom() < enemyTank.top() ||
      this.top() > enemyTank.bottom() ||
      this.right() < enemyTank.left() ||
      this.left() > enemyTank.right()
    );
  }
}

class TankEnemy extends Tank {
  constructor(width, height, x, y) {
    super(width, height, x, y);
    this.speedX = 0;
    this.speedY = 0;
  }

  // draw tank enemy
  update() {
    const img = document.getElementById('tank-enemy');
    myGameArea.context.drawImage(img, this.x, this.y, this.width, this.height);
  }

  posGenerator() {
    myGameArea.frames += 1;
    const arrSpeed = ['x+1', 'x-1', 'y+1', 'y-1'];
    const posSelec = arrSpeed[Math.floor(Math.random() * arrSpeed.length)];
    // eslint-disable-next-line default-case
    if (myGameArea.frames % 50 === 0) {
      // eslint-disable-next-line default-case
      switch (posSelec) {
        case 'x+1':
          this.x += 30;
          break;
        case 'x-1':
          this.x -= 30;
          break;
        case 'y+1':
          this.y += 30;
          break;
        case 'y-1':
          this.y -= 30;
          break;
      }
    }
  }
}

// class Wall {
//   constructor(width, height, x, y) {
//     this.width = width;
//     this.height = height;
//     this.x = x;
//     this.y = y;
//   }

// }

const tank = new Tank(30, 30, 60, 60);
const tankEnemy1 = new TankEnemy(30, 30, 220, 100);
const tankEnemy2 = new TankEnemy(30, 30, 50, 400);
const tankEnemy3 = new TankEnemy(30, 30, 300, 400);
const tankEnemy4 = new TankEnemy(30, 30, 80, 200);
const tankEnemy5 = new TankEnemy(30, 30, 400, 40);

const arrEnemies = [tankEnemy1, tankEnemy2, tankEnemy3];

const checkGameOver = () => {
  const crashed = arrEnemies.some(enemyTank => tank.crashWith(enemyTank));
  if (crashed) {
    myGameArea.stop();
  }
};

const updateGameArea = () => {
  myGameArea.clear();
  tank.newPos();
  tank.update();
  arrEnemies.forEach((enemy) => {
    enemy.posGenerator();
    enemy.newPos();
    enemy.update();
  });
  checkGameOver();
};

// start game
myGameArea.start();

document.onkeydown = (e) => {
  // eslint-disable-next-line default-case
  switch (e.keyCode) {
    case 38: // up arrow
      tank.speedY -= 1;
      break;
    case 40: // down arrow
      tank.speedY += 1;
      break;
    case 37: // left arrow
      tank.speedX -= 1;
      break;
    case 39: // right arrow
      tank.speedX += 1;
      break;
  }
};

document.onkeyup = () => {
  tank.speedX = 0;
  tank.speedY = 0;
};
