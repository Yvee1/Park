const PI = Math.PI;
let width = window.innerWidth;
let height = window.innerHeight;
console.log(width);

const canvas = window.document.createElement("canvas")
canvas.style.width = width + "px"
canvas.style.height = height + "px"

const app = new PIXI.Application({
    width: width,
    height: height, 
    backgroundColor: 0x383838,
    resolution: window.devicePixelRatio || 1,
    antialias: true,
    view: canvas
});
document.body.appendChild(app.view);

let tree = [];
// Listen for window resize events
window.addEventListener('resize', resize);

function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    
	// Resize the renderer
    app.renderer.resize(width, height);
    canvas.style.width = width + "px"
    canvas.style.height = height + "px"

    const diffX = width/2 - root.begin.x;
    const diffY = height - root.begin.y;
    root.begin.x = width/2;
    root.begin.y = height;

    for (branch of tree){
        //branch.begin.x += diff;
        branch.end.x += diffX;
        branch.end.y += diffY;
        branch.show();
    }
    //console.log(tree)
}

const root = new Branch(new p5.Vector(width/2, height), new p5.Vector(width/2, height-height/3), 10);
root.show();
tree.push(root);

let count = 1;
app.ticker.add(() => {
    if (count % 60 == 0 && tree.length < 10000){
        for (let i = tree.length-1; i >= 0; i--){
            if (!tree[i].grown){
                tree.push(tree[i].grow(PI/5+(Math.random()-0.5)*0.4));
                tree.push(tree[i].grow(-PI/5+(Math.random()-0.5)*0.4));
            }
        }
    }
    count++;
})