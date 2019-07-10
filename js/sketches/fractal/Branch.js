class Branch{
    constructor(begin, end, width){
        this.begin = begin;
        this.end = end;
        this.width = width;
        this.graphics = new PIXI.Graphics();
        this.grown = false;
        app.stage.addChild(this.graphics);
    }

    grow(angle){
        const dir = p5.Vector.sub(this.end, this.begin);
        dir.mult(0.67);
        dir.rotate(angle);
        const newEnd = p5.Vector.add(this.end, dir);
        const child = new Branch(this.end, newEnd, this.width * 0.67);
        child.show();
        this.grown = true;
        return child;
    }

    show(){
        this.graphics.clear();
        this.graphics.lineStyle(this.width, 0xffffff, 1);
        this.graphics.moveTo(this.begin.x, this.begin.y);;
        this.graphics.lineTo(this.end.x, this.end.y);
    }
    
}