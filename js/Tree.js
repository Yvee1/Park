class Tree {
  constructor(amount){
    // Tree geometry
    this.geom = new THREE.Geometry();
    this.outline_geom = new THREE.Geometry();

    // Amount of leaves
    this.amount = amount;
    
    // Position of the root of the tree
    this.pos = new THREE.Vector3(0, 0.01, 0);

    // The root, facing up the y-axis
    this.root = new Branch(null, this.pos, new THREE.Vector3(0, 1, 0));

    // Make leaves
    this.leaves = []
    for (let i = 0; i < this.amount; i++){
      this.leaves.push(new Leaf());
    }

    // Add root to list of branches
    this.branches = []
    this.branches.push(this.root);

    // Grow the root of the tree until leaves are in range (of maxDist)
    let current = this.root;
    let found = false;

    while (!found) {

      // Go through leaves and check if one is in range
      for (let i = 0; i < this.leaves.length; i++){
        let d = current.pos.distanceToSquared(this.leaves[i].pos)
        // console.log(d, maxDist);
        if (d < maxDist) {
          found = true;
        }
      }

      // If not, make a new branch and try again
      if (!found) {
        let branch = current.next();
        current = branch;
        this.branches.push(current);
      }
    }
    //console.log("made tree")

    // stuff for frame by frame drawing
    this.drawn = false;
    this.last_drawn = -1;
  }

  // Add all leaves and branches to the scene
  showLeaves(){
    for (let i = 0; i < this.leaves.length; i++){
      this.leaves[i].show();
    }
  }

  showBranches(){
    for (let i = 0; i < this.branches.length; i++){
      // Bottom branches are thicker
      let b = this.branches[i];
      if (i < 50){
        let width = mapRange(i, 0, 50, 1, 0.5);
      }
      else{
        let width = mapRange(i, 0, this.branches.length, 0.5, 0.1);
      }

      b.show(width)
    }
  }

  grow(){
    if (!this.finished){
      // Go through leaves, and nudge the branches accordingly
      for (let i = 0; i < this.leaves.length; i++){
        //console.log("growing");
        let leaf = this.leaves[i];
        
        let closestBranch = null;
        let record = Infinity

        for (let j = 0; j < this.branches.length; j++){
          let branch = this.branches[j];
          let d = leaf.pos.distanceToSquared(branch.pos);
          
          // If this branch is too close to a leaf, mark it to be removed
          if (d < minDist) {
            //console.log("REACHED LEAF")
            leaf.reached = true;
            //leaf.makeRed();
            closestBranch = null;
            break;
          } 
          else if (d > maxDist){
            continue;
          } else if (closestBranch == null || d < record) {
            // Set the closest branch of this leaf.
            closestBranch = branch;
            record = d;
          }
        }

        // If this leaf has a closest branch which it has to attract then:
        if (closestBranch !== null){
          // Calculate unit direction vector of force to be applied
          let newDir = new THREE.Vector3();
          newDir.subVectors(leaf.pos, closestBranch.pos);
          newDir.normalize();

          // Nudge the direction of the closest branch such that child branches
          // will lean towards the leaf
          closestBranch.dir.add(newDir);
          closestBranch.count++;
        }
      }


      // Remove all the marked leaves
      for (let i = this.leaves.length - 1; i >= 0; i--) {
        if (this.leaves[i].reached) {
          this.leaves.splice(i, 1);
        }
      }

      // Make child branches for those branches that were in range of a leaf
      
      let branchUpdates = 0;
      for (let i = this.branches.length-1; i >= 0; i--){
        let branch = this.branches[i];
        if (branch.count > 0) {
          branchUpdates++;

          // Such that length is normalized and "average of forces" is taken
          branch.dir.divideScalar(branch.count+1);

          // Add some randomness such that equidistant leaves also get completed
          let rand = new THREE.Vector3(Math.random(), Math.random());
          rand.setLength(0.05);
          branch.dir.add(rand);

          // Calculate next branch and add it to array and scene
          let next = branch.next();
          this.branches.push(next);
          //next.show();
        }
        // Reset branch for next iteration
        branch.reset();
      }
      if (branchUpdates == 0){
        //this.showBranches();
        this.finished = true;
        //console.log("Finished")
      }
    }
  }

  // Merge meshes into one for better performance
  nextMerge(){
    if (this.finished){
      if(!this.complete){
        if (this.last_drawn < this.branches.length-1){
          let i = this.last_drawn + 1;
          // Bottom branches are thicker
          let b = this.branches[i];
          let width;
          if (i < 80){
            width = mapRange(i, 0, 80, 0.8, 0.25);
          }
          else{
            width = mapRange(i, 0, this.branches.length, 0.5, 0)**2+0.01;
          }
          

          let meshes = b.show(width)
          if (meshes){
            for (let mesh of meshes[0]){
              this.geom.mergeMesh(mesh);
            }
            for (let outline_mesh of meshes[1]){
              this.outline_geom.mergeMesh(outline_mesh);
            }
          }
          this.last_drawn++;
        }
        else{
          if(planted){
            scene.add(treeMesh);
            scene.add(treeOutlineMesh);
            this.complete = true;
          }
        }
      }
    }
  }
}
