class Leaf {
    constructor(){
        this.pos = new THREE.Vector3(Math.random()-0.5, Math.random()-0.5, Math.random()-0.5);
        this.pos.multiplyScalar(Math.random()*10);
        this.pos.y += 10;
    }

    // Add this leaf to the scene
    show(){
        var geometry = new THREE.SphereGeometry( 0.1, 6, 6 );
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