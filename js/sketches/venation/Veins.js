class Veins {
    constructor(){
        this.sources = new Array(nSources);
        this.nodes = [];

        this.nodes.push(new Node(null, width/2, height-height*fromEdge))

        for (let i = 0; i < nSources; i++){
            let rand;
            let found;
            while (!found){
                found = true;
                rand = new p5.Vector(Math.random() * maxWidth + width/2 - maxWidth/2,height-height*fromEdge+height/10 - Math.random() * (maxHeight+height/10));
                for (let source of this.sources){
                    if (source){
                        if (source.position){
                            if (distSqr(rand, source.position) < birthDistSource**2){
                                found = false;
                            }

                            for (let node of this.nodes){
                                if (distSqr(node.position, rand) < birthDistVein**2){
                                    found = false;
                                }
                            }

                            if(!found){
                                break;
                            }
                        }
                    }

                    
                }
            }
            this.sources[i] = new Source(rand);
        }

    }
    
    show(){
        for (let source of this.sources){
            source.show();
        }

        for (let node of this.nodes){
            node.show();
        }
    }
    
    grow() {
        for (let source of this.sources){
            if (source.contained){
                let closest;
                let minDist = Infinity;
                for (let node of this.nodes){
                    let dist = distSqr(node.position, source.position);
                    if (dist < killDist**2){
                        source.depleted = true;
                        closest = null;
                        break;
                    }
                    if (dist < minDist){
                        minDist = dist;
                        closest = node;
                    }
                }

                if (closest !== null){
                    let pull = p5.Vector.sub(source.position, closest.position);
                    pull.normalize();
                    closest.dir.add(pull);
                    closest.count++;
                }
            }
        }

        for (let i = this.sources.length - 1; i >= 0; i--) {
            if (this.sources[i].depleted) {
                app.stage.removeChild(this.sources[i].graphics);
                this.sources.splice(i, 1);
            }
        }

        for (let node of this.nodes){
            if (node.count > 0){
                node.dir.div(node.count);
                this.nodes.push(node.next());
                node.reset();
            }
        }
    }
}