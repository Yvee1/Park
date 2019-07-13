class Source {
    constructor(pos){
        this.position = pos;
        this.graphics = new PIXI.Graphics();
        app.stage.addChild(this.graphics);

        this.contained = false;
    }

    show(){
        if(!this.contained){
            this.checkInsideLeaf();
        }
        this.graphics.clear();
        this.graphics.lineStyle(0)

        if (this.contained){
            this.graphics.beginFill(0xffff00, 1);
        // } else{
        //     this.graphics.beginFill(0x000000, 1);
        // }

        this.graphics.drawCircle(this.position.x, this.position.y, 2);
        this.graphics.endFill();
        this.graphics.beginFill(0x666666, 0.5);
        this.graphics.drawCircle(this.position.x, this.position.y, birthDistSource/2);
        this.graphics.endFill();
        }
    }

    checkInsideLeaf(){
        if (this.position.x <= width/2){
            let interX = curve1.intersects({p1: {x: 0, y: this.position.y}, p2: {x: this.position.x, y: this.position.y}});
            this.contained = interX.length % 2;
        } else{
            let interX = curve2.intersects({p1: {x: this.position.x, y: this.position.y}, p2: {x: width, y: this.position.y}});
            this.contained = interX.length % 2;
        }
    }
}

function distSqr(a, b){
    return (a.x-b.x)**2 + (a.y-b.y)**2;
}