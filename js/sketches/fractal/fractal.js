const PI = Math.PI;
let width = window.innerWidth;
let height = window.innerHeight;

const app = new PIXI.Application({
    width: width,
    height: window.innerHeight, 
    backgroundColor: 0x383838,
    resolution: window.devicePixelRatio || 1,
    antialias: true
});
document.body.appendChild(app.view);

// Listen for window resize events
window.addEventListener('resize', resize);
resize();

function resize() {
    width = window.innerWidth;
    height = window.innerHeight;

	// Resize the renderer
    app.renderer.resize(width, height);
}

let tree = [];
const root = new Branch(new p5.Vector(width/2, height), new p5.Vector(width/2, height-height/3), 10);
root.show();
tree.push(root);

window.addEventListener('click', () => {
    for (let i = tree.length-1; i >= 0; i--){
        if (!tree[i].grown){
            tree.push(tree[i].grow(PI/6+(Math.random()-0.5)*0.3));
            tree.push(tree[i].grow(-PI/6+(Math.random()-0.5)*0.3));
        }
    }
})

let count = 1;
app.ticker.add(() => {
    if (count % 60 == 0 && tree.length < 10000){
        for (let i = tree.length-1; i >= 0; i--){
            if (!tree[i].grown){
                tree.push(tree[i].grow(PI/6+(Math.random()-0.5)*0.3));
                tree.push(tree[i].grow(-PI/6+(Math.random()-0.5)*0.3));
            }
        }
    }
    count++;
})