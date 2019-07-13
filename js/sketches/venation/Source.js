class Source {
    constructor(){
        let rand;
        let found;
        while (!found){
            found = true;
            rand = new p5.Vector(Math.random() * maxWidth + width/2 - maxWidth/2,height-height*fromEdge - Math.random() * maxHeight);
            for (let source of sources){
                if (source){
                    if (source.position){
                        if (distSqr(rand, source.position) < birthDistSource**2){
                            found = false;
                            break;
                        }
                    }
                }
            }
        }
        this.position = rand;
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
        } else{
            this.graphics.beginFill(0x000000, 1);
        }

        this.graphics.drawCircle(this.position.x, this.position.y, 10);
        this.graphics.endFill();
        this.graphics.beginFill(0x666666, 0.5);
        this.graphics.drawCircle(this.position.x, this.position.y, birthDistSource/2);
        this.graphics.endFill();
        
    }

    checkInsideLeaf(){
        if (this.position.x <= width/2){
            let interX = curve1.intersects({p1: {x: 0, y: this.position.y}, p2: {x: width/2, y: this.position.y}}).map(t => curve1.get(t));
            console.log(interX);
            if (interX.length == 1){
                this.contained = interX[0].x < this.position.x;
            }
            if (interX.length == 2){
                // XOR
                this.contained = interX[0].x > this.position.x ? !(interX[1].x > this.position.x) : (interX[1].x > this.position.x);
            }
        } else{
            let interX = curve2.intersects({p1: {x: width/2, y: this.position.y}, p2: {x: width, y: this.position.y}}).map(t => curve2.get(t));
            if (interX.length == 1){
                this.contained = interX[0].x > this.position.x;
            }
            if (interX.length == 2){
                // XOR
                this.contained = interX[0].x > this.position.x ? !(interX[1].x > this.position.x) : (interX[1].x > this.position.x);
            }
        }
    }
}

function distSqr(a, b){
    return (a.x-b.x)**2 + (a.y-b.y)**2;
}