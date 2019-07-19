class Leaf {
  constructor(x, y, size){
    this.x = x;
    this.y = y;
    this.r = size/2;

    this.graphics = new PIXI.Graphics();
  }

  draw(){
    this.graphics.beginFill(PIXI.utils.rgb2hex([this.x+this.y, 100, 0]), 1);
    this.graphics.drawCircle(this.x, this.y, this.r);
    this.graphics.endFill();
  }
}

class Phyllotaxis {
  constructor() {
    this.leaves = [];
    this.angle = 360 / (1+((1 + Math.sqrt(5))/2))/180*Math.PI;
    this.c = 2 + width/600;
    this.n = 0;

    this.t = 0;

    this.speed = 0.05;
    this.yoffset = 1/100000;
  }

  show(){
    console.log("!");
    this.n = 0;
    this.leaves = [];
    for (let i = 0; i < 1000 + width*2.5; i++){
      // let size = 8-n/1000;
      let size = 4 + this.n / 2000;

      if (size <= 0){
        break;
      }

      let a = this.n * this.angle;
      let r = this.c * Math.sqrt(this.n);

      let x = r * Math.cos(a);
      let y = r * Math.sin(a);

      let leaf = new Leaf(x+width/2, y+height/2, size);
      app.stage.addChild(leaf.graphics);
      leaf.draw();
      this.leaves.push(leaf);
      this.n++;
    }
  }

  tick(){
    for (let leaf of this.leaves){
        leaf.graphics.position.y = 50*Math.sin(this.t+leaf.y*this.yoffset);
    }
    
    this.t += this.speed;
  }
}

let width = window.innerWidth;
let height = window.innerHeight;

const canvas = window.document.createElement("canvas")
canvas.style.width = width + "px"
canvas.style.height = height + "px"

const app = new PIXI.Application({
    width: width,
    height: height, 
    backgroundColor: 0x134611,
    resolution: window.devicePixelRatio || 1,
    antialias: true,
    view: canvas
});

document.body.appendChild(app.view);

// Listen for window resize events
window.addEventListener('resize', resize);

const phyllo = new Phyllotaxis();
const gui = new dat.GUI();
gui.add(phyllo, 'speed', 0, 0.4)
gui.add(phyllo, 'yoffset', 0, 0.2)

phyllo.show();

app.ticker.add(() => {
  phyllo.tick();
});

function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    
	// Resize the renderer
    app.renderer.resize(width, height);
    canvas.style.width = width + "px"
    canvas.style.height = height + "px"

    app.stage.removeChildren();
    phyllo.show();
}