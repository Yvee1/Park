/// <reference path="../../libs/p5.global-mode.d.ts" />

let walkers = [];
let size;

function setup(){
    createCanvas(window.innerWidth, window.innerHeight);
    seed = new Walker(0, 0, true);
    walkers.push(seed);
    
    size = min(width, height);
    for (let i = 0; i < size**2/1000; i++){
        walkers.push(new Walker(random(-size/2, size/2), random(-size/2, size/2)));
    }
    noStroke();
}

function draw(){
    background(255);
    translate(width/2, height/2);
    for (let i = 0; i < 10; i++){
       for (let w of walkers){
            if (!w.finished){
                w.walk();
            }
            w.checkCollision(walkers);
        } 
    }

    for (walker of walkers){
        // if (walker.finished){
            walker.show();
        // }
    }
    
}

function windowResized() {
    resizeCanvas(window.innerWidth, window.innerHeight);
}