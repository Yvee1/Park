class Leaf {
    constructor(){
        let rand;

        while (!this.pos){
            rand = new THREE.Vector3((Math.random()-0.5)*2*50, Math.random()*30, (Math.random()-0.5)*2*50);
            // if ( rand.z**2 >= 100 - (rand.x**2/0.9**2+rand.y**2/0.9**2) &&
            if(     rand.y**2 <= 100 - (rand.x**2/0.4**2+rand.z**2/0.4**2) ){
                this.pos = rand
            }
        }

        this.pos.y += 5;
    }

    // Add this leaf to the scene
    show(){
        var geometry = new THREE.SphereBufferGeometry( 0.1, 6, 6 );
        geometry.translate(this.pos.x, this.pos.y, this.pos.z);

        var material = new THREE.MeshStandardMaterial( {color: 0x00ff00} );
        var sphere = new THREE.Mesh( geometry, material );
        this.sphere = sphere;
        scene.add( sphere );
    }

    // For debugging
    makeRed(){
        this.sphere.material.color.setHex(0xff0000);
    }

}