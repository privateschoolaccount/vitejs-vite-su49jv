let sprites = [];
function createNewSprite(...props) {

  this.ctx.imageSmoothingEnabled = false;
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

  this.ctx.drawImage(
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
      let pattern = this.ctx.createPattern(image, 'repeat-x');
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
}
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
      this.ctx.save();
      let visualTranslateY = canvasElement.height - visual.image.height;
      if (visual.top != null) {
        console.log('hooHa');
        if (visual.top) {
          visualTranslateY = 0;
        }
      }

      this.ctx.translate(visual.pos, visualTranslateY);
      this.ctx.fillStyle = visual.pattern;
      this.ctx.fillRect(-visual.pos, 0, canvasElement.width, canvasElement.height);
      visual.pos -= visual.speed * dt;
      this.ctx.restore();
    }
  }
}
let tickCallBacks = [];
function addTickCallBack(cb, before = true) {
  tickCallBacks.push({ cb: cb, before: before });
}

function animationTick(now) {
  for (let i of tickCallBacks) {
    if (!i.before) {
      continue;
    }
    let stop = i.cb(now);
    if (stop == 'stop') {
      return;
    }
  }
  /*
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
  */
  this.ctx.fillStyle = this.gradient;
  this.ctx.fillRect(0, 0, canvasElement.width, canvasElement.height);
  this.ctx.fillStyle = 'white';
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
  for (let i of tickCallBacks) {
    if (i.before) {
      continue;
    }
    let stop = i.cb(now);
    if (stop == 'stop') {
      return;
    }
  }
  /*
  if (promptText == completedText && promptText != '') {
    newGame(true);
  }*/
  requestAnimationFrame(animationTick);
}

export default function initGraphics(ctx,canvasElement){
  let items =  {
    animationTick: animationTick, 
    parrallaxLoop: parrallaxLoop,
    createNewParrallax: createNewParrallax,
    createNewActor: createNewActor,
    createNewSprite: createNewSprite,
  }
  let newItems = {

  }
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
  for(const [k,v] of Object.entries(items)){
    let newFunc = v.bind({ctx:ctx,gradient:gradient});
    console.log(newFunc);
    newItems[k] = newFunc;
  }
  return newItems;
}

