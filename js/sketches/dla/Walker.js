class Walker {
    constructor(x, y, finished){
        this.x = x;
        this.y = y;
        this.r = 5 + size/500;
        this.finished = finished | false;
    }

    show(){
        if(this.finished){
            fill(255, 0, 0);
        } else{
            fill(0, 255, 0);
        }
        circle(this.x, this.y, this.r);
    }

    walk(){
        this.x += 3*(random()-0.5)+(-this.x)/(Math.sqrt(this.x**2 + this.y**2))/10;
        this.y += 3*(random()-0.5)+(-this.y)/(Math.sqrt(this.x**2 + this.y**2))/10;
    }

    checkCollision(others){
        for (let walker of others){
            if (walker !== this){
                if (walker.finished){
                    if((walker.x - this.x)**2 + (walker.y - this.y)**2 <= this.r**2){
                        this.finished = true;
                        break;
                    }
                }
            }
        }
    }
}