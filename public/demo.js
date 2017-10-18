Physijs.scripts.worker = '/Physijs/physijs_worker.js';
Physijs.scripts.ammo = '/Physijs/examples/js/ammo.js';

var scene = new Physijs.Scene();
scene.setGravity(new THREE.Vector3(0, 0, 0))
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 1000 );
camera.lookAt( new THREE.Vector3(0, 0, 0))

var renderer = new THREE.WebGLRenderer( { antialias: true } );
renderer.setClearColor( 0xf0f0f0 );
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

camera.position.z = 5;

var spotLight = new THREE.SpotLight( 0xffffff);
spotLight.position.set( 100, 1000, 100 );
spotLight.castShadow = true;

scene.add(spotLight)

const raycaster = new THREE.Raycaster()
const mouseVector = new THREE.Vector3();

const ground =
  new Physijs.BoxMesh(new THREE.BoxGeometry( 50, 0.01, 10000 ), new THREE.MeshStandardMaterial( { color: 0x000000 }), 0)
ground.position.set(0, -3, 0)
ground.visible = false
ground.__dirtyPosition = true
scene.add(ground)

const ceiling =
  new Physijs.BoxMesh(new THREE.BoxGeometry( 50, 0.01, 10000 ), new THREE.MeshBasicMaterial( { color: 0x00ff00 }), 0)
ceiling.position.set(0, 4, 0)
ceiling.visible = false
ceiling.__dirtyPosition = true
scene.add(ceiling)

const leftWall =
  new Physijs.BoxMesh(new THREE.BoxGeometry( 0.01, 50, 10000 ), new THREE.MeshBasicMaterial( { color: 0x00ff00 }), 0)
leftWall.position.set(-7, 0, 0)
leftWall.visible = false
leftWall.__dirtyPosition = true
scene.add(leftWall)

const rightWall =
  new Physijs.BoxMesh(new THREE.BoxGeometry( 0.01, 50, 10000 ), new THREE.MeshBasicMaterial( { color: 0x00ff00 }), 0)
rightWall.position.set(7, 0, 0)
rightWall.visible = false
rightWall.__dirtyPosition = true
scene.add(rightWall)

const onClick = (e) => {

  mouseVector.set(
      ( e.clientX / window.innerWidth ) * 2 - 1,
      -( e.clientY / window.innerHeight ) * 2 + 1,
      0.5 );

  mouseVector.unproject( camera );

  var dir = mouseVector.sub( camera.position ).normalize();

  var distance = -camera.position.z / dir.z;

  var pos = camera.position.clone().add( dir.multiplyScalar( distance ) );

  const colorArray = [0x40E0D0, 0xd19dc8, 0xd41797, 0x347dd4]

  let mousePosition = new THREE.Vector3()
    mousePosition.x =  2 * (e.clientX / window.innerWidth) - 1;
    mousePosition.y = 1 - 2 * ( e.clientY / window.innerHeight);

    raycaster.setFromCamera( mousePosition.clone(), camera )
    let intersects = raycaster.intersectObjects( scene.children )

    if (intersects.length) {
      if (intersects[0].object.uuid !== ground.uuid || intersects[0].object.uuid !== ceiling.uuid){
        intersects[0].object.setLinearVelocity(new THREE.Vector3(0, 25, 0))
      }
    }
    else {
      let geometry = new THREE.SphereGeometry( 0.4, 0.4, 0.4 );
      let material = new THREE.MeshStandardMaterial({color: colorArray[Math.floor(Math.random() * colorArray.length)]})
      let cube = new Physijs.BoxMesh( geometry, material );
      cube.position.set(pos.x, pos.y, pos.z)
      cube.__dirtyPosition = true
      scene.add(cube)

      let direction = Math.floor(Math.random() * 4)
      switch (direction) {
        case 0:
          cube.setLinearVelocity(new THREE.Vector3(0, 15, 0))
          break;
        case 1:
          cube.setLinearVelocity(new THREE.Vector3(0, -15, 0))
          break;
        case 2:
          cube.setLinearVelocity(new THREE.Vector3(15, 0, 0))
          break;
        case 3:
          cube.setLinearVelocity(new THREE.Vector3(-15, 0, 0))
          break;
        default:
          break;
      }
    }
}

// User interaction
window.addEventListener( 'click', onClick, false );

var render = function () {
  requestAnimationFrame( render );

  scene.simulate()
  renderer.render(scene, camera);
};

render();
