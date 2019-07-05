class Branch {
    constructor(parent, pos, dir){
        this.parent = parent;
        this.pos = pos;
        this.dir = dir;
        this.originalDir = dir.clone();
        this.len = 0.1;
        this.count = 0;
        this.children = [];
    }

    // Calculate child branch
    next(){
        let nextDir = this.dir.clone();
        //console.log(nextDir.length())
        nextDir.multiplyScalar(this.len);
        let nextPos = new THREE.Vector3();
        nextPos.addVectors(this.pos, nextDir);
        let nextBranch = new Branch(this, nextPos, this.dir.clone());
        this.children.push(nextBranch);
        return nextBranch;
    }

    // Add this branch to the scene
    show(width){
        this.width = width;
        if (this.parent !== null){
            let vector = new THREE.Vector3();
            vector.subVectors(this.pos, this.parent.pos);
            //console.log(vector.length())
            
            let geometry = new THREE.CylinderBufferGeometry(this.width, this.parent.width, vector.length()+0.1, 5, 1, true);
            //let material = new THREE.MeshBasicMaterial( {color: 0x23F3FE} );
            let material = new THREE.MeshBasicMaterial( {color: 0x000000} );
            //let material = new THREE.MeshStandardMaterial( {color: 0xA0522D} );
            //let material = new THREE.MeshLambertMaterial( {color: 0xA0522D} );
            let cylinder = new THREE.Mesh( geometry, material );
            let axis = new THREE.Vector3(0, 1, 0);
            cylinder.quaternion.setFromUnitVectors(axis, vector.clone().normalize());
            cylinder.position.copy(vector.clone().add(this.parent.pos));
            
            //this.cylinder = cylinder;
            //console.log(cylinder);
            
            let outlineMaterial = new THREE.MeshBasicMaterial( { color: 0xffffff, side: THREE.BackSide } );
            let outlineMesh1 = new THREE.Mesh( geometry, outlineMaterial );
            outlineMesh1.position.copy(cylinder.position.clone());
            outlineMesh1.quaternion.setFromUnitVectors(axis, vector.clone().normalize());
            outlineMesh1.scale.multiplyScalar(1.1);

            this.mesh = cylinder;
            scene.add( outlineMesh1 );
            scene.add( cylinder );

            //console.log(!this.childre)

            //let controlPoint = this.pos.clone().add(vector.clone().setLength(this.len * 0.5));
            //let curve = new THREE.CatmullRomCurve3([this.pos, controlPoint, this.parent.pos]);


            if (!(this.children.length > 0)){
                let geometry = new THREE.CircleBufferGeometry( this.width, 32 );
                let material = new THREE.MeshBasicMaterial( { color: 0x000000 } );
                geometry.rotateX(-PI/2);
                let circle = new THREE.Mesh( geometry, material );
                
                circle.quaternion.setFromUnitVectors(axis, vector.clone().normalize());
                circle.position.copy(vector.clone().add(this.parent.pos).add(vector));
                scene.add( circle );

                let outlineMaterial = new THREE.MeshBasicMaterial( { color: 0xffffff, side: THREE.BackSide } );
                let outlineMesh2 = new THREE.Mesh( geometry, outlineMaterial );
                outlineMesh2.quaternion.setFromUnitVectors(axis, vector.clone().normalize());
                outlineMesh2.position.copy(vector.clone().add(this.parent.pos).add(vector));
                outlineMesh2.scale.multiplyScalar(1.1);
                scene.add(outlineMesh2);
            }

            if (this.parent.parent === null){
                //console.log("!!!!!!!!!")
                let geometry = new THREE.CircleBufferGeometry( this.width, 32 );
                let material = new THREE.MeshBasicMaterial( { color: 0x000000 } );
                geometry.rotateX(PI/2);
                let circle = new THREE.Mesh( geometry, material );
                circle.material.side = THREE.DoubleSide;
                scene.add( circle );

                let outlineMaterial = new THREE.MeshBasicMaterial( { color: 0xffffff, side: THREE.BackSide } );
                let outlineMesh2 = new THREE.Mesh( geometry, outlineMaterial );
                outlineMesh2.scale.multiplyScalar(1.1);
                scene.add(outlineMesh2);
            }



            //scene.add( new THREE.Mesh( new THREE.SphereGeometry( this.width**2, 5, 5 ).translate(this.pos.x, this.pos.y, this.pos.z), new THREE.MeshBasicMaterial( {color: 0xA0522D} )) );
        }
    }

    // Reset this branch...
    reset(){
        this.dir = this.originalDir.clone();
        this.count = 0
    }
}
