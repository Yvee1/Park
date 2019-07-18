/// <reference path="../../libs/p5.global-mode.d.ts" />

function windowResized() {
  resizeCanvas(window.innerWidth, window.innerHeight);
}

let sentence;
let nextSentence;
// const rules = {
//   F: "F[+F]F[-F]F"
// }

// const rules = {
//   X: "F[+X][-X]FX",
//   F: "FF"
// }

const rules = {
  F: "FF-[-F+F+F]+[+F-F-F]",
  X: "X"
}

let L;

function setup() {
  canvas = createCanvas(window.innerWidth, window.innerHeight);
  canvas.parent('sketch-holder');

  angleMode(DEGREES);

  L = new Lindenmayer(200, 22.5, "F", rules);
  let gui = new dat.GUI();
  //gui.remember(L);

  gui.add(L, 'angle', 0, 360);
  gui.add(L, 'originalLen', 1, 1000).name("Length").onChange(value => L.reset());

  let modding = gui.add(L, 'currentSentence').listen().name("Current sentence");
  modding.onChange(value => L.draw()); 

  gui.add(L, 'iterate');
  gui.add(L, 'reset');

  let ruleset = gui.addFolder('Ruleset');
  ruleset.add(L.ruleset, 'F');
  ruleset.add(L.ruleset, 'X');
}

class Lindenmayer {
  constructor(len, angle, axiom, ruleset){
    this.angle = angle;
    this.axiom = axiom;
    this.ruleset = ruleset;

    this.originalLen = len;
    this.len = len;

    this.currentSentence = axiom;
    this.draw();
  }

  iterate(){
    if (this.currentSentence !== ""){
      this.calculate();
      this.draw();
    }
  }

  calculate(){
    this.len *= 0.5;

    let nextSentence = "";
    for (const char of this.currentSentence){
      if(rules.hasOwnProperty(char)){
        nextSentence += rules[char]
      } else{
        nextSentence += char;
      }
    }
    this.currentSentence = nextSentence;
  }

  draw(){
    background(255);
    stroke(0);
    resetMatrix();
    translate(width/2, height);
    for (const char of this.currentSentence){
      if (char == "F"){
        line(0, 0, 0, -this.len);
        translate(0, -this.len);
      } else if (char == "+") {
        rotate(-this.angle);
      } else if (char == "-") {
        rotate(this.angle)
      } else if (char == "[") {
        push();
      } else if (char == "]") {
        pop();
      }
    }

  }

  reset(){
    this.currentSentence = "";
    this.len = this.originalLen;
    this.draw();
  }
}
