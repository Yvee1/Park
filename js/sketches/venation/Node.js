class Node {
    constructor(parent, x, y, dir = new p5.Vector(0, 0)){
        this.position = new p5.Vector(x, y)
        this.graphics = new PIXI.Graphics();
        app.stage.addChild(this.graphics);

        this.count = 0;
        this.dir = dir;
        this.parent = parent;
        this.len = 5;
    }

    show(){
        this.graphics.clear();

        this.graphics.lineStyle(0)
        this.graphics.beginFill(0x000000, 1);
        this.graphics.drawCircle(this.position.x, this.position.y, 2);
        this.graphics.endFill();
        
    }

    next(){
        let nextDir = this.dir.copy();
        nextDir.mult(this.len);

        let nextPos = p5.Vector.add(this.position, nextDir);
        return new Node(this, nextPos.x, nextPos.y);
    }

    reset(){
        this.dir.mult(0);
        this.count = 0;
    }
}