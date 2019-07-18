let n = 0;
const c = 6;
const angle = 360 / (1+((1 + Math.sqrt(5))/2));
let leaves = [];

function setup() {
  canvas = createCanvas(window.innerWidth, window.innerHeight);
  angleMode(DEGREES);
  // Move the canvas so it’s inside our <div id="sketch-holder">.
  canvas.parent('sketch-holder');
  show();
}

function windowResized() {
  resizeCanvas(window.innerWidth, window.innerHeight);
}

function draw() {
  background(255);
  translate(width/2, height/2);
  fill(0)
  for (let i = 0; i < leaves.length; i++){
    leaves[i].y += sin(i/100)
    leaves[i].show();
  }
}

function show(){
  for (let i = 0; i < 5000; i++){
    let size = 8-n/1000;
    if (size <= 0){
      break;
    }

    let a = n * angle;
    let r = c * sqrt(n);

    let x = r * cos(a);
    let y = r * sin(a);

    leaves.push(new Leaf(x, y, size));
    n++;
  }
}

class Leaf {
  constructor(x, y, r){
    this.x = x;
    this.y = y;
    this.r = r;
  }

  show(){
    circle(this.x, this.y, this.r);
  }
}