const PI = Math.PI

// three.js globals
let container;
let camera;
let cameraY = 7;
let controls;
let renderer;
let scene;
let mesh;

// map interval to another interval linearly
function mapRange(value, low1, high1, low2, high2) {
  return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
}

// tree globals
let maxDist = 20;
let minDist = 0.1;

let treeMesh;
let treeOutlineMesh

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
  createLights();
  createRenderer();
  createPlane();

  // let canvas resize
  window.addEventListener( 'resize', onWindowResize );
  window.addEventListener("scroll", updateCamera);

  // start the animation loop
  renderer.setAnimationLoop( () => {

    update();
    render();

  } );

  createTree();
}

let t = 0;
let delta = 0;
function update() {
  // Calculate the branches
  tree.grow();


  if(tree){
    for (let i = 0; i < 10; i++){tree.nextMerge()}
    
    // Grow animation
    if(tree.complete){
        treeMesh.material.uniforms.delta.value = delta;
        treeOutlineMesh.material.uniforms.delta.value = delta;
        delta += 0.08;
    }
  }

  // Camera rotation in circle
  camera.position.set(30*Math.sin(t), cameraY, 30*Math.cos(t));
  camera.lookAt(0, (7+2*cameraY)/3, 0);
  t += 0.002;
}

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
  const fov = 35;
  const aspect = container.clientWidth / container.clientHeight;

  const near = 0.1;
  const far = 100;

  camera = new THREE.PerspectiveCamera( fov, aspect, near, far );
  camera.position.set( 0, 7, 30 );
}

function createPlane(){
  const geometry = new THREE.PlaneBufferGeometry( 200, 200, 70, 70);
  geometry.rotateX(-PI/2);

  const material = new THREE.MeshBasicMaterial( { color: "white", wireframe: true } );

  mesh = new THREE.Mesh( geometry, material );
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
  renderer = new THREE.WebGLRenderer( { antialias: true, canvas: document.getElementById("viewport") } );
  renderer.setSize( container.clientWidth, container.clientHeight );

  renderer.setPixelRatio( window.devicePixelRatio );
}

// a function that will be called every time the window gets resized.
function onWindowResize() {
  // set the aspect ratio to match the new browser window aspect ratio
  camera.aspect = container.clientWidth / container.clientHeight;

  // update the camera's frustum
  camera.updateProjectionMatrix();

  // update the size of the renderer and the canvas
  renderer.setSize( container.clientWidth, container.clientHeight );
}

function createTree() {
  // vertex and fragment shaders for grow animation

  const vS = `
  varying vec3 vUv;

  void main() 
  {
    vUv = position;

    vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * modelViewPosition;
  }`

  const treeFS = `
  uniform float delta;
  varying vec3 vUv;

  void main() {
    gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0-step(delta, vUv.y));
  }`

  const outlineFS = `
  uniform float delta;
  varying vec3 vUv;

  void main() {
    gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0-step(delta, vUv.y));
  }`

  /////////////////////////////////////////////////////////////

  let customUniforms = {
    delta: {value: 0}
  };
  
  const tMat = new THREE.ShaderMaterial({
    uniforms: customUniforms,
    vertexShader: vS,
    fragmentShader: treeFS,
    transparent: true
  });

  const outlineMat = new THREE.ShaderMaterial({
    uniforms: customUniforms,
    vertexShader: vS,
    fragmentShader: outlineFS,
    transparent: true,
    side: THREE.BackSide
  });

  tree = new Tree(amount);
  treeMesh = new THREE.Mesh(tree.geom, tMat);
  treeOutlineMesh = new THREE.Mesh(tree.outline_geom, outlineMat);
}

function updateCamera(ev) {
  cameraY = 7 - window.scrollY / 20.0;
  //console.log(cameraY)
}