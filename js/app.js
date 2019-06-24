// const canvas = document.getElementById('my-canvas');
// const ctx = canvas.getContext('2d');

// Inicial config
const myGameArea = {
  canvas: document.createElement('canvas'),
  start: function() {
    this.canvas.width = 500;
    this.canvas.height = 500;
    this.context = this.canvas.getContext("2d");
    document.body.insertBefore(this.canvas, document.body.childNodes[0]);
    this.interval = setInterval(updateGameArea, 20);
    
  },
  clear: function() {
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


const tank = new Tank(60, 60, 60, 60);

const updateGameArea = () => {
  myGameArea.clear();
  tank.newPos();
  tank.update();
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
