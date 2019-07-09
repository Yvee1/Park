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

window.mobileAndTabletcheck = function() {
  var check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
};

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
  if (window.mobileAndTabletcheck()) {
    window.addEventListener('deviceorientation', handleOrientationMove);
  } else {
    window.addEventListener('mousemove', handleMouseMove);
  }
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
  if(!scrolling){
    mousePosition.x = event.clientX || (event.touches && event.touches[0].clientX) || mousePosition.x;
    mousePosition.y = event.clientY || (event.touches && event.touches[0].clientY) || mousePosition.y;
    normalizedOrientation.set(
      -((mousePosition.x / container.clientWidth) - 0.5) * cameraAmpl.x,
      ((mousePosition.y / container.clientHeight) - 0.5) * cameraAmpl.y,
      0.5,
    );
  }
}

function handleOrientationMove(event) {
  // https://stackoverflow.com/questions/40716461/how-to-get-the-angle-between-the-horizon-line-and-the-device-in-javascript
  if(!scrolling){
    const rad = Math.atan2(event.gamma, event.beta);
    if (Math.abs(rad) > 1.5) return;
    normalizedOrientation.x = -(rad) * cameraAmpl.y;
  }
  // TODO handle orientation.y
}

