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
            // Direction vector for the cylinder
            let vector = new THREE.Vector3();
            vector.subVectors(this.pos, this.parent.pos);
            
            // Create the cylinder
            let geometry = new THREE.CylinderGeometry(this.width, this.parent.width, vector.length()+0.1, 32, 1, true);
            let material = new THREE.MeshBasicMaterial( {color: 0x000000} );
            let cylinder = new THREE.Mesh( geometry, material );
            
            // Position it correctly
            let axis = new THREE.Vector3(0, 1, 0);
            cylinder.quaternion.setFromUnitVectors(axis, vector.clone().normalize());
            cylinder.position.copy(vector.clone().add(this.parent.pos));

            // Another cylinder that's a bit bigger for an outline effect            
            let outlineMaterial = new THREE.MeshBasicMaterial( { color: 0xffffff, side: THREE.BackSide } );
            let outlineMesh1 = new THREE.Mesh( geometry, outlineMaterial );
            outlineMesh1.position.copy(cylinder.position.clone());
            outlineMesh1.quaternion.setFromUnitVectors(axis, vector.clone().normalize());
            outlineMesh1.scale.multiplyScalar(1.1);

            let meshes = [];
            let outline_meshes = [];

            outline_meshes.push(outlineMesh1);
            meshes.push(cylinder);
            
            // Add circle to the end of branches so you can't see into the tree
            if (this.children.length == 0){
                let geometry = new THREE.CircleGeometry( this.width, 32 );
                let material = new THREE.MeshBasicMaterial( { color: 0x000000 } );
                geometry.rotateX(-PI/2);
                let circle = new THREE.Mesh( geometry, material );
                
                circle.quaternion.setFromUnitVectors(axis, vector.clone().normalize());
                circle.position.copy(vector.clone().add(this.parent.pos).add(vector));
                meshes.push(circle)

                let outlineMaterial = new THREE.MeshBasicMaterial( { color: 0xffffff, side: THREE.BackSide } );
                let outlineMesh2 = new THREE.Mesh( geometry, outlineMaterial );
                outlineMesh2.quaternion.setFromUnitVectors(axis, vector.clone().normalize());
                outlineMesh2.position.copy(vector.clone().add(this.parent.pos).add(vector));
                outlineMesh2.scale.multiplyScalar(1.1);
                outline_meshes.push(outlineMesh2);
            }

            // Add circle to the bottom of the root so that you can't see into the tree
            if (this.parent.parent === null){
                let geometry = new THREE.CircleGeometry( this.width, 32 );
                let material = new THREE.MeshBasicMaterial( { color: 0x000000 } );
                geometry.rotateX(PI/2);
                let circle = new THREE.Mesh( geometry, material );
                circle.position.add(tree.pos);
                circle.material.side = THREE.DoubleSide;
                meshes.push(circle);

                let outlineMaterial = new THREE.MeshBasicMaterial( { color: 0xffffff, side: THREE.DoubleSide } );
                let outlineMesh2 = new THREE.Mesh( geometry, outlineMaterial );
                outlineMesh2.position.add(tree.pos);
                outlineMesh2.scale.multiplyScalar(1.1);
                outline_meshes.push(outlineMesh2);
            }

            return [meshes, outline_meshes]

        }
    }

    // Reset this branch
    reset(){
        this.dir = this.originalDir.clone();
        this.count = 0
    }
}
