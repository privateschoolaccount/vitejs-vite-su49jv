import * as graphics from 'canvasCode.js';
//save accuracy

let audio = new Audio(
  'https://staticfiles-eight.vercel.app/mr_khan_typer_demo_1%20(1).wav'
);
audio.loop = true;
audio.autoplay = true;
let canvasElement = document.getElementById('canvas');
let body = document.body;
let paused = false;
let ctx = canvasElement.getContext('2d');

let lionImage = new Image();
lionImage.src = 'lionImage.png';
let ostrichImage = new Image();
ostrichImage.src = 'roadRunner.png';
let clawMarkImage = new Image();
clawMarkImage.src = 'clawMark.jpeg';
let winImage = new Image();

winImage.src = 'win.webp';

let loseImage = new Image();
loseImage.src = 'lose.jpeg';
let gunnyRunImage = new Image();
gunnyRunImage.src = 'sonicspritesheet.png';
canvasElement.width = window.innerWidth;
canvasElement.height = 512;
let sprites = [];
/*
function createNewSprite(...props) {
  ctx.imageSmoothingEnabled = false;
  //x,y,spriteData,scale
  let x = props[0];
  let y = props[1];
  let spriteData = props[2];
  let scale;
  let sizeX;
  let sizeY;
  let zIndex;
  let frames;
  let speed;
  let r = {
    id: sprites.length, // we don't minus one bc we want the current 0 based length + 1 for a new id
    x: x,
    y: y,
    spriteData: spriteData,
    remove() {
      this.disabled = true;
    },
    disabled: false,
    frame: 0,
    lastTime: Date.now(),
    frames: 1,
    speed: 0,
    zIndex: 0,
    loop: true,
  };
  console.log(props);
  if (props.length == 4 || props.length == 7) {
    scale = props[3];
    r.scale = scale;
  } else {
    sizeX = props[3];
    sizeY = props[4];

    r.sizeX = sizeX;
    r.sizeY = sizeY;
  }
  if (props.length > 5) {
    zIndex = props[props.length - 3];
    frames = props[props.length - 2];
    speed = props[props.length - 1];
    r.zIndex = zIndex;
    r.frames = frames;
    r.speed = speed;
    r.frame = 0;
    r.lastTime = Date.now();
  }

  sprites.push(r);
  return r;
}
function drawAnimatedVisual(visual) {
  if (Date.now() - visual.lastTime > visual.speed) {
    visual.lastTime = Date.now();
    visual.frame++;
    if (visual.frame >= visual.frames) {
      if (visual.loop) {
        visual.frame = 0;
      } else {
        visual.frame = visual.frames - 1;
      }
      //visual.frame=visual.loop ? 0 : visual.frames-1;
    }
  }
  let width;
  let height;
  if (visual.scale != null) {
    width = (visual.spriteData.width / visual.frames) * visual.scale;
    height = visual.spriteData.height * visual.scale;
  }
  if (visual.sizeX != null && visual.sizeY != null) {
    width = visual.sizeX;
    height = visual.sizeY;
  }
  //console.log("skibidi",visual);
  //console.log((visual.spriteData.width/visual.frames)*visual.frame,0,visual.spriteData.width,visual.spriteData.height,visual.x-width/2,visual.y-height/2,width,height);

  ctx.drawImage(
    visual.spriteData,
    (visual.spriteData.width / visual.frames) * visual.frame,
    0,
    visual.spriteData.width / visual.frames,
    visual.spriteData.height,
    visual.x - width / 2,
    visual.y - height / 2,
    width,
    height
  );
}
*/
/*
let actors = [];
function createNewActor(x, y, visual, variables = {}) {
  let actor = {
    id: actors.length,
    x: x,
    y: y,
    visual: visual,
    _state: 'main',
    setState(state) {
      this._state = state;
      let cb = this.stateCallbacks[state];
      if (cb != null) {
        cb();
      }
    },
    stateCallbacks: {},
    variables: variables,
    remove() {
      this.disabled = true;
    },
    disabled: false,
  };
  actors.push(actor);
  return actor;
}
let parrallaxes = [];
function createNewParrallax(...props) {
  let parrallax = [];
  for (let i of props) {
    let image = new Image();
    image.src = i.image;
    //console.log(image);
    image.onload = () => {
      let pattern = ctx.createPattern(image, 'repeat-x');
      console.log(pattern);
      let speed = i.speed;
      let top = i.top;
      let zIndex = i.zIndex;
      parrallax.push({
        top: top,
        speed: speed,
        image: image,
        pattern: pattern,
        zIndex: zIndex,
        pos: 0,
      });
    };
  }
  parrallaxes.push(parrallax);
  return parrallax;
}*/
graphics.createNewParrallax(
  {
    speed: 1000,
    image: 'khanRoad.png',
    zIndex: 1500,
  },
  {
    speed: 600,
    image: 'sandClumps.png',
    zIndex: 1200,
  },
  {
    speed: 250,
    image: 'khanMountain.png',
    zIndex: 900,
  } /*
    {
        speed:100,
        image:"khanBg1.png",
        zIndex:1000,
    },
    {
        speed:100,
        image:"khanBg2.png",
        zIndex:900,
    },
    {
        speed:100,
        image:"khanBg3.png",
        zIndex:800,
    },*/,
  {
    speed: 300,
    image: 'khanCloud1.png',
    zIndex: 2000,
    top: true,
  },
  {
    speed: 400,
    image: 'khanCloud2.png',
    zIndex: 2500,
    top: true,
  }
);
function parrallaxLoop(dt) {
  for (let parrallax of parrallaxes) {
    parrallax.sort((a, b) => {
      return a.zIndex - b.zIndex;
    });
    for (let visual of parrallax) {
      //console.log(visual);
      if (Math.abs(visual.pos) >= canvasElement.width) {
        //to make it smooth
        //visual.pos = canvasElement.width%visual.pos;
      }
      //console.log(visual.image.height);
      ctx.save();
      let visualTranslateY = canvasElement.height - visual.image.height;
      if (visual.top != null) {
        console.log('hooHa');
        if (visual.top) {
          visualTranslateY = 0;
        }
      }

      ctx.translate(visual.pos, visualTranslateY);
      ctx.fillStyle = visual.pattern;
      ctx.fillRect(-visual.pos, 0, canvasElement.width, canvasElement.height);
      visual.pos -= visual.speed * dt;
      ctx.restore();
    }
  }
}
let winsIndicatorElement = document.getElementById('winsIndicator');
function setWinsIndicator(wins) {
  winsIndicatorElement.innerHTML = `Wins:${wins}`;
}

let wins = 0;

setWinsIndicator(wins);
let totalKeysHit = 0;
let keysHit = 0;
let totalKeysHitCorrectly = 0;
let keysHitCorrectly = 0;
let health = 8;
let healthIndicatorElement = document.getElementById('healthIndicator');
healthIndicatorElement.innerHTML = `Health:${health}`;
let lionVisual = graphics.createNewSprite(256, 256, lionImage, 0.5);
let winVisual = graphics.createNewSprite(
  canvasElement.width / 2,
  canvasElement.height / 2,
  winImage,
  canvasElement.width,
  canvasElement.height,
  500,
  1,
  0
);
winVisual.remove();
let loseVisual = graphics.createNewSprite(
  canvasElement.width / 2,
  canvasElement.height / 2,
  loseImage,
  canvasElement.width,
  canvasElement.height,
  500,
  1,
  0
);
loseVisual.remove();
let lionActor = createNewActor(256, 256, lionVisual);
let loadingNewGame = false;
let timeIndicatorElement = document.getElementById('timeIndicator');
let timer = 10000;
let timePerCharacter = 400;
let accuracyIndicatorElement = document.getElementById('accuracyIndicator');
function setAccuracyIndicator(decimal) {
  accuracyIndicatorElement.innerHTML = `Accuracy: ${Math.round(
    decimal * 100
  )}%`;
}
setAccuracyIndicator(1);
timeIndicatorElement.innerHTML = `Time Left:${timer}`;
setInterval(() => {
  if (paused) {
    return;
  }
  timer--;
  timeIndicatorElement.innerHTML = `Time Left:${Math.floor(
    timer * timePerCharacter * 0.001
  )}`;
  if (timer <= 0) {
    newGame();
  }
}, timePerCharacter);

let scores = {
  version: 2,
  hiScore: 0,
  overallAccuracy: 1,
  promptScores: {},
};
function saveScores() {
  localStorage.setItem('scores', JSON.stringify(scores));
}
function getScores() {
  let item = localStorage.getItem('scores');
  if (item != null) {
    scores = JSON.parse(item);
    if (scores.version == 1) {
      scores.overallAccuracy = 1;
      scores.version = 2;
    }
  }
}
getScores();
let hiScoreIndicatorElement = document.getElementById('hiScoreIndicator');
function setHiScoreIndicator(score) {
  hiScoreIndicatorElement.innerHTML = `Hi Score:${score}`;
}
setHiScoreIndicator(scores.hiScore);
let restartButton = document.getElementById('restartButton');
function restartGame(visual) {
  //alert("sss");
  loadingNewGame = false;
  visual.remove();
  changeText();
  setHealth(8);
  restartButton.className = '';
  restartButton.onclick = () => {};
}

function newGame(won = false) {
  if (loadingNewGame) {
    return;
  }
  //console.log(scores);
  if (promptText != 'start') {
    wins = won ? wins + 1 : 0;
  }

  if (wins > scores.hiScore) {
    scores.hiScore = wins;
  }
  setHiScoreIndicator(scores.hiScore);
  setWinsIndicator(wins);
  if (scores.promptScores[promptText] == null) {
    scores.promptScores[promptText] = {
      accuracies: [],
      wins: 0,
    };
  }
  scores.promptScores[promptText].accuracies.push(keysHitCorrectly / keysHit);
  scores.promptScores[promptText].wins += won ? 1 : 0;
  console.log(scores.promptScores[promptText]);
  keysHitCorrectly = 0;
  keysHit = 0;
  scores.overallAccuracy = totalKeysHitCorrectly / totalKeysHit;
  //setAccuracyIndicator(1);
  saveScores();
  body.className = 'activeAnimation';
  setTimeout(() => {
    body.className = '';
  }, 300);
  loadingNewGame = true;
  let visual = won ? winVisual : loseVisual;
  visual.disabled = false;
  if (won) {
    setTimeout(() => {
      restartGame(visual);
    }, 500);
  } else {
    restartButton.onclick = () => {
      restartGame(visual);
    };
    restartButton.className = 'restartVisible';
  }
}
function setHealth(hp) {
  if (hp < health) {
    healthIndicatorElement.className = 'activeAnimation';
    setTimeout(() => (healthIndicatorElement.className = ''), 100);
  }
  health = hp;
  healthIndicatorElement.innerHTML = `Health:${health}`;
}
lionActor.stateCallbacks['slash'] = () => {
  console.log('ss');
  setHealth(health - 1);

  if (health <= 0) {
    newGame(false);
    //ostrichVisual.remove();
  }
  let clawMark = graphics.createNewSprite(550, 256, clawMarkImage, 0.5);
  setTimeout(() => {
    lionActor.setState('main');
    clawMark.remove();
  }, 500);
};
let ostrichVisual = graphics.createNewSprite(600, 256, ostrichImage, 1);
let gunnyRunVisual = graphics.createNewSprite(256, 256, gunnyRunImage, 10, 500, 10, 60);
gunnyRunVisual.loop = false;
let promptElement = document.getElementById('prompt');
let fullIndicatorElement = document.getElementById('full');
let completedText = '';
let promptText = '';
let promptCharacters = [];
let lastTime = performance.now();

let gradient = ctx.createLinearGradient(0, 0, 0, 500);
/*gradient.addColorStop(0,"#4c3d2e");
gradient.addColorStop(0.1,"#4c3d2e");
gradient.addColorStop(0.15,"#855f39");
gradient.addColorStop(0.3,"#d39741");
gradient.addColorStop(0.7,"yellow");
gradient.addColorStop(1,"yellow");*/
gradient.addColorStop(0, 'yellow');
gradient.addColorStop(0.1, 'yellow');
gradient.addColorStop(0.3, '#d39741');
gradient.addColorStop(0.45, '#855f39');
gradient.addColorStop(0.7, '#4c3d2e');
gradient.addColorStop(1, '#4c3d2e');
/*
function animationTick(now) {
  if (
    gunnyRunVisual.frame == gunnyRunVisual.frames - 1 &&
    !gunnyRunVisual.loop
  ) {
    //alert("kazaa");
    started = true;
    gunnyRunVisual.disabled = true;
    promptElement.className = 'started';
  }
  if (paused) {
    requestAnimationFrame(animationTick);
    return;
  }
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvasElement.width, canvasElement.height);
  ctx.fillStyle = 'white';
  let dt = now - lastTime;
  lastTime = now;
  parrallaxLoop(dt / 1000);
  for (let i of actors) {
    if (i.disabled) {
      continue;
    }
    i.visual.x = i.x;
    i.visual.y = i.y;
  }
  sprites.sort((a, b) => {
    return a.zIndex - b.zIndex;
  });
  for (let i of sprites) {
    //console.log(i);
    if (i.disabled) {
      continue;
    }
    drawAnimatedVisual(i);
  }
  if (promptText == completedText && promptText != '') {
    newGame(true);
  }
  requestAnimationFrame(animationTick);
}*/
graphics.animationTick();
function getRandomInt(min, max) {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // The maximum is exclusive and the minimum is inclusive
}
let levels = [];
fetch('levels.json')
  .then((res) => {
    return res.json();
  })
  .then((json) => {
    levels = json;

    loadGame();
  });
function chooseRandomText() {
  let text = '';
  let index = getRandomInt(0, levels.length);
  text = levels[index].text;
  if (text == promptText) {
    return chooseRandomText();
  }
  return text;
}
function changeText(text = '') {
  if (text == '') {
    text = chooseRandomText();
  }
  completedText = '';

  promptText = text;
  promptElement.innerHTML = '';
  for (let i of promptText) {
    promptElement.innerHTML += `<span>${i}</span>`;
  }
  promptCharacters = Array.from(promptElement.children);
  timer = promptText.length;
}
let started = false;
graphics.addCallBack((now) => {
  if (
    gunnyRunVisual.frame == gunnyRunVisual.frames - 1 &&
    !gunnyRunVisual.loop
  ) {
    //alert("kazaa");
    started = true;
    gunnyRunVisual.disabled = true;
    promptElement.className = 'started';
  }
});
graphics.addCallBack((now) => {
  if (paused) {
    requestAnimationFrame(graphics.animationTick);
    return 'stop';
  }
});
graphics.addCallBack((now) => {
  if (promptText == completedText && promptText != '') {
    newGame(true);
  }
}, false);
function loadGame() {
  changeText('start');
  timer = Infinity;
  function onKeyDownCallBack(e) {
    console.log(sprites);
    if (e.key == 'Alt') {
      paused = !paused;
    }
    if (paused || !started) {
      return;
    }
    if (
      ['Shift', 'Control', 'Alt', 'F23', 'Enter', 'CapsLock', 'Tab'].includes(
        e.key
      )
    ) {
      return;
    }
    totalKeysHit++;
    keysHit++;
    let key = e.key;
    if (e.shiftKey) {
      key = key.toUpperCase();
    }
    if (key != 'Backspace') {
      if (completedText.length == promptText.length) {
        fullIndicatorElement.className = 'activeAnimation';
        setTimeout(() => (fullIndicatorElement.className = ''), 300);

        return;
      }
      completedText += key;
      let promptCharacter = promptText[completedText.length - 1];
      let promptCharacterElement = promptCharacters[completedText.length - 1];
      //console.log(promptCharacter);
      if (key != promptCharacter) {
        lionActor.setState('slash');
        let className = promptCharacter == ' ' ? 'incorrectSpace' : 'incorrect';
        //completedElement.innerHTML += `<span class = '${className}'>${promptCharacter}</span>`;
        promptCharacterElement.className = className;
      } else {
        //console.log(totalKeysHitCorrrectly);
        totalKeysHitCorrectly++;
        keysHitCorrectly++;
        //completedElement.innerHTML+= `<span>${key}</span>`;
        promptCharacterElement.className = 'correct';
      }
    } else {
      let promptCharacter = promptText[completedText.length - 1];
      let promptCharacterElement = promptCharacters[completedText.length - 1];
      completedText = completedText.slice(0, completedText.length - 1);
      promptCharacterElement.className = '';
    }
    setAccuracyIndicator(totalKeysHitCorrectly / totalKeysHit);
  }
  document.addEventListener('keydown', onKeyDownCallBack);
}
