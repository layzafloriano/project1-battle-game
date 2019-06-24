const posGenerator = () => {
  let x = 0;
  let y = 0;
  const arrSpeed = ['x+1', 'x-1', 'y+1', 'y-1'];
  const posSelec = arrSpeed[Math.floor(Math.random() * arrSpeed.length)];
  console.log(posSelec);
  // eslint-disable-next-line default-case
  switch (posSelec) {
    case 'x+1':
      x += 1;
      console.log('entrou 1');
      console.log(`valor de x: ${x}`);
      break;
    case 'x-1':
      x -= 1;
      console.log('entrou 2');
      console.log(`valor de x: ${x}`);
      break;
    case 'y+1':
      y += 1;
      console.log('entrou 3');
      console.log(`valor de y: ${y}`);
      break;
    case 'y-1':
      y -= 1;
      console.log('entrou 4');
      console.log(`valor de y: ${y}`);
      break
  }
};

posGenerator();
