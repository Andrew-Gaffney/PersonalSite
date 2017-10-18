Physijs.scripts.worker = '/js/Physijs/physijs_worker.js';
Physijs.scripts.ammo = '/js/Physijs/examples/js/ammo.js';

var scene = new Physijs.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 1000 );
camera.lookAt( new THREE.Vector3(0, 0, 0))

var renderer = new THREE.WebGLRenderer( { antialias: true } );
renderer.setClearColor( 0xf0f0f0 );
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

camera.position.z = 5;

// Picking stuff

const raycaster = new THREE.Raycaster()
const mouseVector = new THREE.Vector3();
const ground =
  new Physijs.BoxMesh(new THREE.BoxGeometry( 50, 0.01, 10000 ), new THREE.MeshBasicMaterial( { color: 0x00ff00 }), 0)
ground.position.set(0, -3, 0)
ground.visible = false
ground.__dirtyPosition = true
scene.add(ground)

const onClick = (e) => {

  mouseVector.set(
      ( e.clientX / window.innerWidth ) * 2 - 1,
      -( e.clientY / window.innerHeight ) * 2 + 1,
      0.5 );

  mouseVector.unproject( camera );

  var dir = mouseVector.sub( camera.position ).normalize();

  var distance = -camera.position.z / dir.z;

  var pos = camera.position.clone().add( dir.multiplyScalar( distance ) );

  let mousePosition = new THREE.Vector3()
    mousePosition.x =  2 * (e.clientX / window.innerWidth) - 1;
  	mousePosition.y = 1 - 2 * ( e.clientY / window.innerHeight);

    raycaster.setFromCamera( mousePosition.clone(), camera )
    let intersects = raycaster.intersectObjects( scene.children )

    if (intersects.length) {
      if (intersects[0].object.uuid !== ground.uuid){
        intersects[0].object.setLinearVelocity(new THREE.Vector3(0, 10, 0))
      }
    }
    else {
      let geometry = new THREE.BoxGeometry( 0.4, 0.4, 0.4 );
      let material = new THREE.MeshBasicMaterial( {color: 0x40E0D0}/*{ color: 0x00ff00 }*/ );
      let cube = new Physijs.BoxMesh( geometry, material );
      cube.position.set(pos.x, pos.y, pos.z)
      cube.__dirtyPosition = true
      scene.add(cube)
    }
}

// User interaction
window.addEventListener( 'click', onClick, false );
// var dragControls = new THREE.DragControls( scene.children.filter(child => {
//   return child.uuid !== ground.uuid
// }), camera, renderer.domElement );
// dragControls.addEventListener( 'dragstart', function ( event ) { controls.enabled = false; } );
// dragControls.addEventListener( 'dragend', function ( event ) { controls.enabled = true; } );

var render = function () {
  requestAnimationFrame( render );

  scene.simulate()
  renderer.render(scene, camera);
};

render();
