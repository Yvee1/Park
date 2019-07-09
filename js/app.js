const PI = Math.PI

// three.js globals
let container;
let camera;
let targetCameraY = 7;
let currentCameraY = 7;
let controls;
let renderer;
let scene;
let mesh;
let sphere;
let sphereY;
let planted = false;

// map interval to another interval linearly
function mapRange(value, low1, high1, low2, high2) {
  return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
}

// tree globals
const maxDist = 20;
const minDist = 0.1;

let treeMesh;
let treeOutlineMesh

let amount = 150
let tree;

let mousePosition;
let normalizedOrientation = new THREE.Vector3();
let cameraAmpl = {x: 10, y: 10};
let cameraVelocity = 0.1;

let scrolling;
let scrollDetector;
const fuse = 300;

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
  createGround();
  //createPlane();

  // Event listeners
  window.addEventListener( 'resize', onWindowResize );
  window.addEventListener('scroll', updateCamera);
  window.addEventListener('mousemove', handleMouseMove);
  mousePosition = {x: container.clientWidth/2, y:container.clientHeight/2}

  // Start camera on correct location
  updateCamera();
  scrolling = false;

  // start the animation loop
  renderer.setAnimationLoop( () => {

    update();
    render();

  } );

  tree = new Tree(amount);

  const sphereGeom = new THREE.SphereBufferGeometry(0.5, 12, 12);
  const sphereMat = new THREE.MeshBasicMaterial({wireframe: true, color:"lightgreen"})
  sphere = new THREE.Mesh( sphereGeom, sphereMat );
  sphere.position.y = 20;
  sphereParams = {y: 20, a: 0.1};
  sphereTarget = {y: 0, a: 0.01};
  scene.add(sphere);
  const tweenPos = new TWEEN.Tween(sphereParams).to(sphereTarget, 5000)
                .easing(TWEEN.Easing.Quadratic.Out)
                .onUpdate(() => { 
                                  sphere.position.y = sphereParams.y;
                                  sphere.rotateY(sphereParams.a);
                                })
                .onComplete(() => planted = true)
                .start();

  if (!scrollDetector){
    scrollDetector = setTimeout(bomb, fuse)
  }
}

function bomb(){
  scrolling = false;
  scrollDetector = setTimeout(bomb, fuse);
}

let t = 0;
let delta = 0;
function update() {
  // Calculate the branches
  tree.grow();

  TWEEN.update();

  if(tree.finished){
    //for (let i = 0; i < 5; i++){tree.nextMerge()}

    if (!tree.complete){
      tree.merge();
      createTree();
    }
    
    // Grow animation
    if(tree.complete){
        scene.remove(sphere)
        treeMesh.material.uniforms.delta.value = delta;
        treeOutlineMesh.material.uniforms.delta.value = delta;
        delta += 0.08;
    }
  }

  // Camera rotation in circle
  // camera.position.set(30*Math.sin(t), targetCameraY, 30*Math.cos(t));

  if (!scrolling){  
    normalizedOrientation.set(
      -((mousePosition.x / container.clientWidth) - 0.5) * cameraAmpl.x,
      ((mousePosition.y / container.clientHeight) - 0.5) * cameraAmpl.y,
      0.5,
    );
    camera.position.x += (normalizedOrientation.x - camera.position.x) * cameraVelocity;
    camera.position.y += (normalizedOrientation.y - camera.position.y + targetCameraY) * cameraVelocity;
    currentCameraY = targetCameraY;
  }
  else{
    camera.position.y += (normalizedOrientation.y - camera.position.y + targetCameraY) * 0.2;
    currentCameraY = camera.position.y - normalizedOrientation.y;
  }

  camera.lookAt(0, (7+2*currentCameraY)/3, 0);

  //camera.lookAt(0, 7, 0);
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

function createGround(){
  const geometry = new THREE.PlaneBufferGeometry( 200, 200, 70, 70);
  geometry.rotateX(-PI/2);

  const material = new THREE.MeshBasicMaterial( { color: "white", wireframe: true } );

  mesh = new THREE.Mesh( geometry, material );
  //mesh.position.y += 0.01
  scene.add( mesh );
  scene.add(new THREE.Mesh( new THREE.PlaneBufferGeometry( 200, 200, 1, 1).rotateX(-PI/2), new THREE.MeshBasicMaterial({color: "black", side:THREE.DoubleSide})))
}

function createPlane(){
  const geometry = new THREE.PlaneBufferGeometry( 25, 40, 70, 70);

  const material = new THREE.MeshBasicMaterial( { color: "darkgreen", wireframe: false } );
  const plane = new THREE.Mesh( geometry, material )
  plane.position.y -= 20;
  scene.add(plane);
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

  console.log(tree);
  treeMesh = new THREE.Mesh(tree.geom, tMat);
  treeOutlineMesh = new THREE.Mesh(tree.outline_geom, outlineMat);
  scene.add(treeMesh);
  scene.add(treeOutlineMesh);
}

function updateCamera(event) {
  scrolling = true;
  targetCameraY = 7 - window.scrollY / 20.0;

  clearTimeout(scrollDetector)
  scrollDetector = setTimeout(bomb, fuse)
}

// adapted from https://github.com/Jeremboo/animated-mesh-lines/blob/master/app/decorators/HandleCameraOrbit.js
function handleMouseMove(event) {
    mousePosition.x = event.clientX || (event.touches && event.touches[0].clientX) || mousePosition.x;
    mousePosition.y = event.clientY || (event.touches && event.touches[0].clientY) || mousePosition.y;
}