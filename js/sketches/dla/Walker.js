class Walker {
    constructor(x, y, finished){
        if (arguments.length == 0){
            this.x = random(-size/2, size/2);
            this.y = random(-size/2, size/2);
            this.finished = false;
        } else{
            this.x = x;
            this.y = y;
            this.finished = finished;
        }
        this.r = 5 + size/500;

        // For quadtree
        this.width = 2*this.r;
        this.height = 2*this.r;
    }

    show(){
        if(this.finished){
            fill(0, 0, 0);
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
                        if (random() < 0.4){
                            walkers.push(new Walker());
                        }
                        break;
                    }
                }
            }
        }
    }

    checkInsideCircle(r){
        if (this.x**2 + this.y**2 < r**2){
            this.finished = true;
            if (random() < 0.4){
                walkers.push(new Walker());
            }
        }
    }
}