class Node {
    constructor(parent, x, y, dir = new p5.Vector(0, 0)){
        this.position = new p5.Vector(x, y)
        this.graphics = new PIXI.Graphics();
        app.stage.addChild(this.graphics);

        this.count = 0;
        this.dir = dir;
        this.parent = parent;
        this.children = [];
        this.len = 5;

        this.width = 0;
        this.layer = 1;
    }

    show(){
        this.calculateWidth();
        if (this.parent !== null){
            this.graphics.clear();

            if (this.width > 0){
                this.graphics.lineStyle(this.width, 0x00ff00, 0.9);
            } else{
                this.graphics.lineStyle(2, 0x00ff00, 0.9);
            }
            this.graphics.moveTo(this.parent.position.x, this.parent.position.y);
            this.graphics.lineTo(this.position.x, this.position.y);
        }
    }

    next(){
        let nextDir = this.dir.copy();
        nextDir.mult(this.len);

        let nextPos = p5.Vector.add(this.position, nextDir);
        let child = new Node(this, nextPos.x, nextPos.y);
        child.layer = this.layer;
        if (this.children.length > 0){
            child.layer += 1;
        }
        this.children.push(child);
        return child;
    }

    reset(){
        this.dir.mult(0);
        this.count = 0;
    }

    calculateWidth(){
        // Base case
        if (this.children.length == 0){
            this.width = 0.5;
            return 1;
        }

        let cubed = 0;
        for (let child of this.children){
            cubed += child.calculateWidth() ** 3;
        }
        if (this.layer <= 2){
            cubed += 1;
        }
        this.width = cubed ** (1/3);
        return this.width
    }
}