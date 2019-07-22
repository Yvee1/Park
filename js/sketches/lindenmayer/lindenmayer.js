/// <reference path="../../libs/p5.global-mode.d.ts" />

function windowResized() {
  resizeCanvas(window.innerWidth, window.innerHeight);
  L.draw();
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

const ruleset = {
  F: "",
  X: ""
};

let sentence;
let nextSentence;
let L;

function setup() {
  canvas = createCanvas(window.innerWidth, window.innerHeight);
  canvas.parent('sketch-holder');

  angleMode(DEGREES);

  L = new Lindenmayer(200, presets['plant6']);
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
    preset: "plant6"
  }
  system.add(choice, 'preset', names).onChange(name => L.setPreset(presets[name]));

  system.add(L, 'angle', 0, 360).listen();
  system.add(L, 'axiom').listen();
  const rulesetFolder = system.addFolder('Ruleset');
  
  rulesetFolder.add(ruleset, 'F').listen().onChange(rule => L.ruleset.F = rule);
  rulesetFolder.add(ruleset, 'X').listen().onChange(rule => L.ruleset.X = rule);
}

class Lindenmayer {
  constructor(len, preset){
    this.setPreset(preset);

    this.originalLen = len;
    this.len = len;

    this.currentSentence = this.axiom;
    this.draw();


    this.layer = 1;
    this.recordLayer = 1;
    this.stack = [];
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
    resetMatrix();
    translate(width/2, height);
    for (const char of this.currentSentence){
      if (char == "F"){
        stroke(50, (this.layer/this.recordLayer)*150, 0, 150)
        line(0, 0, 0, -this.len);
        translate(0, -this.len);
      } else if (char == "+") {
        rotate(-this.angle);
        this.layer++;
        if(this.layer > this.recordLayer){
          this.recordLayer = this.layer;
        }
      } else if (char == "-") {
        rotate(this.angle)
        this.layer++;
        if(this.layer > this.recordLayer){
          this.recordLayer = this.layer;
        }
      } else if (char == "[") {
        push();
        this.stack.push(this.layer);
      } else if (char == "]") {
        pop();
        this.layer = this.stack.pop();
      }
    }

  }

  reset(){
    this.layer = 1;
    this.recordLayer = 1;
    this.stack = [];

    this.currentSentence = this.axiom;
    this.len = this.originalLen;
    this.draw();
  }

  setPreset(preset){
    for (let property in preset){
      this[property] = preset[property];
    }
    this.reset();

    for (let letter in preset.ruleset){
      ruleset[letter] = preset.ruleset[letter];
    }
  }
}
