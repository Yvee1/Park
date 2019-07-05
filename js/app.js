const PI = Math.PI

// three.js globals
let container;
let camera;
let controls;
let renderer;
let scene;
let mesh;

// map interval to another interval linearly
function map_range(value, low1, high1, low2, high2) {
  return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
}

// tree globals
let max_dist = 20;
let min_dist = 0.1;

let amount = 150
let tree;

// start everything
init();

function init() {

  // Get a reference to the container element that will hold our scene
  container = document.querySelector( '#scene-container' );

  // create a Scene
  scene = new THREE.Scene();
  scene.background = new THREE.Color( "black" );
  scene.fog = new THREE.Fog(0x000000, 20, 100);

  createCamera();
  //createControls();
  //createBox();
  createLights();
  createRenderer();
  createPlane();

  // let canvas resize
  window.addEventListener( 'resize', onWindowResize );

  // start the animation loop
  renderer.setAnimationLoop( () => {

    update();
    render();

  } );

  //setTimeout(function(){
    // make a tree
    tree = new Tree(amount);
    console.log(tree);
    //console.log(tree);
    //tree.showLeaves();
    //while(!tree.finished){
      
    //}
  //}, 1000);
}

// perform any updates to the scene, called once per frame
// avoid heavy computation here

let t = 0;
function update() {
  tree.grow();
  // // increase the mesh's rotation each frame
  if(tree){
    tree.nextFrame();
    //if(tree.complete){
      
    //}
    
  }

  camera.position.set(30*Math.sin(t), 7, 30*Math.cos(t));
  camera.lookAt(0, 7, 0);
  t += 0.002;
}

// render, or 'draw a still image', of the scene
function render() {

  renderer.render( scene, camera );

}

function createControls(){
  controls = new THREE.OrbitControls( camera, container );
  controls.target.set(0, 7, 0)

  // such that first frame is correct
  controls.update();
}

function createCamera(){
  // set up the options for a perspective camera
  const fov = 35; // fov = Field Of View
  const aspect = container.clientWidth / container.clientHeight;

  const near = 0.1;
  const far = 100;

  camera = new THREE.PerspectiveCamera( fov, aspect, near, far );

  // every object is initially created at ( 0, 0, 0 )
  // we'll move the camera back a bit so that we can view the scene
  camera.position.set( 0, 7, 30 );
}

function createBox(){
  // create a geometry
  const geometry = new THREE.BoxBufferGeometry( 2, 2, 2 );

   // create a purple Standard material
  const material = new THREE.MeshStandardMaterial( { color: "white" } );

  // create a Mesh containing the geometry and material
  mesh = new THREE.Mesh( geometry, material );

  // add the mesh to the scene object
  scene.add( mesh );
}

function createPlane(){
  // create a geometry
  const geometry = new THREE.PlaneBufferGeometry( 200, 200, 50, 50);
  geometry.rotateX(-PI/2);

  // create a purple Standard material
  const material = new THREE.MeshBasicMaterial( { color: "white", wireframe: true } );

  // create a Mesh containing the geometry and material
  mesh = new THREE.Mesh( geometry, material );

  // add the mesh to the scene object
  scene.add( mesh );
}

function createLights(){
  const ambientLight = new THREE.AmbientLight( 0xffffff, 1 );
  scene.add( ambientLight );

  const mainLight = new THREE.DirectionalLight( 0xffffff, 1 );
  mainLight.position.set( 10, 10, 10 );

  scene.add( ambientLight, mainLight );
}

function createRenderer(){
  // create a WebGLRenderer and set its width and height
  renderer = new THREE.WebGLRenderer( { antialias: true } );
  renderer.setSize( container.clientWidth, container.clientHeight );

  renderer.setPixelRatio( window.devicePixelRatio );

  // add the automatically created <canvas> element to the page
  container.appendChild( renderer.domElement );
}

// a function that will be called every time the window gets resized.
// It can get called a lot, so don't put any heavy computation in here!
function onWindowResize() {

  // set the aspect ratio to match the new browser window aspect ratio
  camera.aspect = container.clientWidth / container.clientHeight;


  // update the camera's frustum
  camera.updateProjectionMatrix();

  // update the size of the renderer AND the canvas
  renderer.setSize( container.clientWidth, container.clientHeight );

}