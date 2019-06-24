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
    myGameArea.context.drawImage(img, this.x, this.y);
  }

  // change position
  newPos() {
    this.x += this.speedX;
    this.y += this.speedY;
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
    myGameArea.context.drawImage(img, this.x, this.y);
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


const tank = new Tank(60, 60, 60, 60);
const tankEnemy = new TankEnemy(60, 60, 230, 100);

const updateGameArea = () => {
  myGameArea.clear();
  tank.newPos();
  tank.update();
  tankEnemy.posGenerator();
  tankEnemy.newPos();
  tankEnemy.update();
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
