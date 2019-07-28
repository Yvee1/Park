class Branch {
    constructor(parent, pos, dir){
        this.parent = parent;
        this.pos = pos;
        this.dir = dir;
        this.originalDir = dir.clone();
        this.len = 0.1;
        this.count = 0;
        this.children = [];
        this.height = 0;
    }

    // Calculate child branch
    next(){
        let nextDir = this.dir.clone();
        nextDir.multiplyScalar(this.len);

        let nextPos = new THREE.Vector3();
        nextPos.addVectors(this.pos, nextDir);

        let nextBranch = new Branch(this, nextPos, this.dir.clone());
        this.children.push(nextBranch);
        nextBranch.height = this.height + 1;
        return nextBranch;
    }

    // Add this branch to the scene
    show(width){
        if (!isNaN(width)){
            this.width = width;
            if (this.parent !== null){
                // Direction vector for the cylinder
                let vector = new THREE.Vector3();
                vector.subVectors(this.pos, this.parent.pos);
                
                // Create the cylinder
                let geometry = new THREE.CylinderBufferGeometry(this.width, this.parent.width, vector.length()+0.1, 32, 1, true);
                let material = new THREE.MeshBasicMaterial( {color: 0x000000} );
                let cylinder = new THREE.Mesh( geometry, material );
                
                // Position it correctly
                let axis = new THREE.Vector3(0, 1, 0);
                cylinder.quaternion.setFromUnitVectors(axis, vector.clone().normalize());
                cylinder.position.copy(vector.clone().add(this.parent.pos));

                // Another cylinder that's a bit bigger for an outline effect            
                let outlineMaterial = new THREE.MeshBasicMaterial( { color: 0xffffff, side: THREE.BackSide } );
                let outlineMesh1 = new THREE.Mesh( geometry.clone(), outlineMaterial );
                outlineMesh1.position.copy(cylinder.position.clone());
                outlineMesh1.quaternion.setFromUnitVectors(axis, vector.clone().normalize());
                outlineMesh1.scale.multiplyScalar(1.1);

                let geoms = [];
                let outlineGeoms = [];

                outlineMesh1.updateMatrix();
                outlineMesh1.geometry.applyMatrix(outlineMesh1.matrix);
                outlineGeoms.push(outlineMesh1.geometry);

                cylinder.updateMatrix();
                cylinder.geometry.applyMatrix(cylinder.matrix);
                geoms.push(cylinder.geometry);
                
                // Add circle to the end of branches so you can't see into the tree
                if (this.children.length == 0){
                    let geometry = new THREE.CircleBufferGeometry( this.width, 32 );
                    let material = new THREE.MeshBasicMaterial( { color: 0x000000 } );
                    geometry.rotateX(-PI/2);
                    let circle = new THREE.Mesh( geometry, material );
                    
                    circle.quaternion.setFromUnitVectors(axis, vector.clone().normalize());
                    circle.position.copy(vector.clone().add(this.parent.pos).add(vector));

                    let outlineMaterial = new THREE.MeshBasicMaterial( { color: 0xffffff, side: THREE.BackSide } );
                    let outlineMesh2 = new THREE.Mesh( geometry.clone(), outlineMaterial );
                    outlineMesh2.quaternion.setFromUnitVectors(axis, vector.clone().normalize());
                    outlineMesh2.position.copy(vector.clone().add(this.parent.pos).add(vector));
                    outlineMesh2.scale.multiplyScalar(1.1);

                    circle.updateMatrix();
                    circle.geometry.applyMatrix(circle.matrix);
                    geoms.push(circle.geometry);
                    outlineMesh2.updateMatrix();
                    outlineMesh2.geometry.applyMatrix(outlineMesh2.matrix)
                    outlineGeoms.push(outlineMesh2.geometry);
                }

                // Add circle to the bottom of the root so that you can't see into the tree
                if (this.parent.parent === null){
                    let geometry = new THREE.CircleBufferGeometry( this.width, 32 );
                    
                    geometry.rotateX(PI/2);
                    geometry.translate(tree.pos.x, tree.pos.y, tree.pos.z)
                    geoms.push(geometry)

                    let outlineGeom = new THREE.BufferGeometry();
                    outlineGeom.copy(geometry);
                    outlineGeom.scale(1.1, 1.1, 1.1)
                    outlineGeoms.push(outlineGeom)       
                }

                return [geoms, outlineGeoms]

            }
        }
    }

    // Reset this branch
    reset(){
        this.dir = this.originalDir.clone();
        this.count = 0
    }
}
