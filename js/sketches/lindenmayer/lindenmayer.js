/// <reference path="../../libs/p5.global-mode.d.ts" />

function windowResized() {
  resizeCanvas(window.innerWidth, window.innerHeight);
}

const presets = {
  plant1: {
    angle: 25.7, 
    axiom: "F", 
    ruleset: {
      F: "F[+F]F[-F]F",
      X: "X"
    }
  },

  plant2: {
    angle: 20, 
    axiom: "F", 
    ruleset: {
      F: "F[+F]F[-F][F]",
      X: "X"
    }
  },

  plant3: {
    angle: 22.5, 
    axiom: "F", 
    ruleset: {
      F: "FF-[-F+F+F]+[+F-F-F]",
      X: "X"
    }
  },

  plant4: {
    angle: 20, 
    axiom: "X", 
    ruleset: {
      F: "FF",
      X: "F[+X]F[-X]+X"
    }
  },

  plant5: {
    angle: 25.7, 
    axiom: "X", 
    ruleset: {
      F: "FF",
      X: "F[+X][-X]FX"
    }
  },

  plant6: {
    angle: 22.5, 
    axiom: "X", 
    ruleset: {
      F: "FF",
      X: "F-[[X]+X]+F[+FX]-X"
    }
  },
}

let sentence;
let nextSentence;
let L;

function setup() {
  canvas = createCanvas(window.innerWidth, window.innerHeight);
  canvas.parent('sketch-holder');

  angleMode(DEGREES);

  L = new Lindenmayer(200, presets['plant1']);
  //const gui = new dat.GUI({load: getPresetJSON(), preset: 'Preset1'});
  const gui = new dat.GUI();
  //gui.remember(L);
  gui.add(L, 'originalLen', 1, 1000).name("Length").onChange(value => L.reset());

  const modding = gui.add(L, 'currentSentence').listen().name("Current sentence");
  modding.onChange(value => L.draw()); 

  gui.add(L, 'iterate');
  gui.add(L, 'reset');
  const system = gui.addFolder('System');

  let names = [];
  for (let preset in presets){
    names.push(preset);
  }

  const choice = {
    preset: "plant1"
  }
  system.add(choice, 'preset', names).onChange(name => L.setPreset(presets[name]));

  system.add(L, 'angle', 0, 360).listen();
  system.add(L, 'axiom').listen();
  const ruleset = system.addFolder('Ruleset');
  ruleset.add(L.ruleset, 'F').listen();
  ruleset.add(L.ruleset, 'X').listen();
}

class Lindenmayer {
  constructor(len, preset){
    this.setPreset(preset);

    this.originalLen = len;
    this.len = len;

    this.currentSentence = this.axiom;
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
      if(this.ruleset.hasOwnProperty(char)){
        nextSentence += this.ruleset[char]
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
    this.currentSentence = this.axiom;
    this.len = this.originalLen;
    this.draw();
  }

  setPreset(preset){
    for (let property in preset){
      this[property] = preset[property];
    }
    this.reset();
  }
}
