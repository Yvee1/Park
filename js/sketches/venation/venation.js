const PI = Math.PI;
let width = window.innerWidth;
let height = window.innerHeight;

const canvas = window.document.createElement("canvas")
canvas.style.width = width + "px"
canvas.style.height = height + "px"

const app = new PIXI.Application({
    width: width,
    height: height, 
    backgroundColor: 0xffffff,
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

}
let count = 1;

let leaf = new PIXI.Graphics();
app.stage.addChild(leaf);
leaf.lineStyle(10, 0x00ff00, 1);
leaf.moveTo(width/2, 5*height/6);

let c1 = new p5.Vector(Math.random() * width/2, Math.random() * height/2);
let c2 = new p5.Vector(Math.random() * width/2, Math.random() * height/2);

let control1 = new PIXI.Graphics();
control1.interactive = true;
control1.buttonMode = true;
// Add a hit area..
app.stage.addChild(control1);

let control2 = new PIXI.Graphics();
control2.interactive = true;
control2.buttonMode = true;
app.stage.addChild(control2);

control1.lineStyle(0)
control1.beginFill(0xff0000, 1);
control1.drawCircle(0, 0, 20);
control1.endFill();
control1.position.x = c1.x;
control1.position.y = c1.y;
control1.hitArea = new PIXI.Circle(0, 0, 20);

control1.on('pointerdown', onDragStart)
        .on('pointerup', onDragEnd)
        .on('pointerupoutside', onDragEnd)
        .on('pointermove', onDragMove);

control2.lineStyle(0)
control2.beginFill(0x0000ff, 1);
control2.drawCircle(0, 0, 20);
control2.endFill();
control2.position.x = c2.x;
control2.position.y = c2.y;
control2.hitArea = new PIXI.Circle(0, 0, 20);


control2.on('pointerdown', onDragStart)
        .on('pointerup', onDragEnd)
        .on('pointerupoutside', onDragEnd)
        .on('pointermove', onDragMove);

leaf.bezierCurveTo(
    c1.x, c1.y,
    c2.x, c2.y,
    width/2, height/6,
);

leaf.bezierCurveTo(
    width-c2.x, c2.y,
    width-c1.x, c1.y,
    width/2, 5*height/6,
);

app.ticker.add(() => {
    count++;
})

function onDragStart(event) {
    // store a reference to the data
    // the reason for this is because of multitouch
    // we want to track the movement of this particular touch
    this.data = event.data;
    this.alpha = 0.5;
    this.dragging = true;
}

function onDragEnd() {
    this.alpha = 1;
    this.dragging = false;
    // set the interaction data to null
    this.data = null;
}

function onDragMove() {
    if (this.dragging) {
        const newPosition = this.data.getLocalPosition(this.parent);
        this.position.x = newPosition.x;
        this.position.y = newPosition.y;
        redraw();
    }
}

function redraw(){
    leaf.clear();
    leaf.moveTo(width/2, 5*height/6);

    leaf.bezierCurveTo(
        control1.position.x, control1.position.y,
        control2.position.x, control2.position.y,
        width/2, height/6,
    );

    leaf.bezierCurveTo(
        width-control2.position.x, control2.position.y,
        width-control1.position.x, control1.position.y,
        width/2, 5*height/6,
    );
}