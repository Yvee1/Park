const PI = Math.PI;
let width = window.innerWidth;
let height = window.innerHeight;
let began;

const birthDistVein = 50;
const birthDistSource = 50;
const maxWidth = 3*width/4;
const maxHeight = 3*height/4;
const nSources = 80;
let sources = new Array(nSources);

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
let fromEdge = 1/8;

let leaf = new PIXI.Graphics();
app.stage.addChild(leaf);
leaf.lineStyle(10, 0x00ff00, 1);
leaf.moveTo(width/2, height-fromEdge*height);

let c1 = new p5.Vector(Math.random() * width/2, Math.random() * height/2);
let c2 = new p5.Vector(Math.random() * width/2, Math.random() * height/2);

let control1 = new PIXI.Graphics();
control1.interactive = true;
control1.buttonMode = true;
app.stage.addChild(control1);

let control2 = new PIXI.Graphics();
control2.interactive = true;
control2.buttonMode = true;
app.stage.addChild(control2);

let endPoint = new PIXI.Graphics();
endPoint.interactive = true;
endPoint.buttonMode = true;
endPoint.fixedX = true;
app.stage.addChild(endPoint);

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

endPoint.lineStyle(0)
endPoint.beginFill(0xff00ff, 1);
endPoint.drawCircle(0, 0, 20);
endPoint.endFill();
endPoint.position.x = width/2;
endPoint.position.y = height/2;
endPoint.hitArea = new PIXI.Circle(0, 0, 20);


endPoint.on('pointerdown', onDragStart)
        .on('pointerup', onDragEnd)
        .on('pointerupoutside', onDragEnd)
        .on('pointermove', onDragMove);



for (let i = 0; i < nSources; i++){
    sources[i] = new Source();
}



let curve1 = new Bezier(width/2, height-height*fromEdge, c1.x, c1.y, c2.x, c2.y, width/2, height/2);
let curve2 = new Bezier(width/2, height-height*fromEdge, width-c1.x, c1.y, width-c2.x, c2.y, width/2, height/2)
let table1 = curve1.getLUT();
let table2 = curve2.getLUT();

let scale = 1;
let currentWidth = 0;
let currentHeight = 0;

app.ticker.add(() => {
    leaf.clear();
    leaf.moveTo(width/2, height-height*fromEdge);
    let leftX = Infinity;
    let topY = Infinity;

    for (point of table1){
        leaf.lineTo(point.x, point.y);
        if (point.x < leftX){
            leftX = point.x;
        }
        if (point.y < topY){
            topY = point.y;
        }
    }
    currentWidth = (width/2-leftX)*2;
    currentHeight = (height-height*fromEdge-topY);

    leaf.moveTo(width/2, height-height*fromEdge);
    for (point of table2){
        leaf.lineTo(point.x, point.y);
    }
    if(began){
        let mx = width/2;
        let my = height-height*fromEdge;
        curve1 = new Bezier(mx, my, (control1.position.x-mx)*scale+mx, (control1.position.y-my)*scale + my, (control2.position.x-mx)*scale+mx, (control2.position.y-my)*scale+my, (endPoint.x-mx)*scale+mx, (endPoint.y-my)*scale+my);
        table1 = curve1.getLUT();
        curve2 = new Bezier(mx, my, width-((control1.position.x-mx)*scale+mx), (control1.position.y-my)*scale + my, width-((control2.position.x-mx)*scale+mx), (control2.position.y-my)*scale+my, (endPoint.x-mx)*scale+mx, (endPoint.y-my)*scale+my);
        table2 = curve2.getLUT();
 

        for (let source of sources){
            source.show();
        }

        if (currentWidth < maxWidth && currentHeight < maxHeight){
            scale += 0.001;
        }
    }
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
        if (newPosition.x > width/2 || this.fixedX){
            newPosition.x = width/2;
        }
        this.position.x = newPosition.x;
        this.position.y = newPosition.y;

        curve1 = new Bezier(width/2, height-height*fromEdge, control1.position.x, control1.position.y, control2.position.x, control2.position.y, endPoint.x, endPoint.y);
        table1 = curve1.getLUT();
        curve2 = new Bezier(width/2, height-height*fromEdge, width-control1.position.x, control1.position.y, width-control2.position.x, control2.position.y, endPoint.x, endPoint.y);
        table2 = curve2.getLUT();
    }
}

function start(){
    app.stage.removeChild(control1);
    app.stage.removeChild(control2);
    app.stage.removeChild(endPoint);
    began = true;
    table1 = curve1.getLUT();
}