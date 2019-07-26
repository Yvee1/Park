/// <reference path="../../libs/p5.global-mode.d.ts" />

let walkers = [];
let size;

let qt;

function setup(){
    createCanvas(window.innerWidth, window.innerHeight);
    size = min(width, height);

    seed = new Walker(0, 0, true);
    walkers.push(seed);

    qt = new Quadtree({
        x: 0,
        y: 0,
        width: width,
        height: height 
    })

    for (let i = 0; i < size**2/1000; i++){
        walkers.push(new Walker(random(-size/2, size/2), random(-size/2, size/2), false));
    }

    // stroke(255);
    noStroke();

    for (let w of walkers){
        if (w.finished){
            qt.insert(w);
        }
    }
}

function draw(){
    if (frameCount % 120 == 0){
        console.log(frameRate());
    }
    qt.clear();
    for (let w of walkers){
        if (w.finished){
            qt.insert(w);
        }
    }


    background(255);
    translate(width/2, height/2);
    for (let i = 0; i < 10; i++){
        for (let w of walkers){
            if (!w.finished){
                w.walk();
                w.checkCollision(qt.retrieve(w));
            }
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