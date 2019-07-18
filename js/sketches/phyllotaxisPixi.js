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

function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    
	// Resize the renderer
    app.renderer.resize(width, height);
    canvas.style.width = width + "px"
    canvas.style.height = height + "px"

    app.stage.removeChildren();
    show();
}

let n;
const c = 2 + width/600;
const angle = 360 / (1+((1 + Math.sqrt(5))/2))/180*Math.PI;
let leaves;

show();
let t = 0;

app.ticker.add(() => {
    for (leaf of leaves){
        leaf.graphics.position.y = 50*Math.sin(t+leaf.y/100000);
    }
    
    t += 0.05
});

function show(){
    n = 0;
    leaves = [];
  for (let i = 0; i < 1000 + width*2.5; i++){
    // let size = 8-n/1000;
    let size = 4 + n / 2000;

    if (size <= 0){
      break;
    }

    let a = n * angle;
    let r = c * Math.sqrt(n);

    let x = r * Math.cos(a);
    let y = r * Math.sin(a);

    let leaf = new Leaf(x+width/2, y+height/2, size);
    app.stage.addChild(leaf.graphics);
    leaf.draw();
    leaves.push(leaf);
    n++;
  }
}

