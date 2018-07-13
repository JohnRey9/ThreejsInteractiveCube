let aCamera, aScene, aRenderer, aRaycaster, controls, 
    aCubesGroup = new THREE.Group(), aSelectedItem, aCount = 3;

init();
animate();

function init() {
  aCamera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 10000);
  aCamera.position.z = 1000;

  aScene = new THREE.Scene();
  aScene.background = new THREE.Color(0xcccccc);

  aRaycaster = new THREE.Raycaster();
  aRaycaster.params.Points.threshold = 3;



  for (let i = 0; i < aCount; i++) {
    let aCube = new ThreejsInteractiveCube(true);
    aCubesGroup.add(aCube);
  }

  aScene.add(aCubesGroup);

  aRenderer = new THREE.WebGLRenderer();
  aRenderer.setPixelRatio(window.devicePixelRatio);
  aRenderer.setSize(window.innerWidth, window.innerHeight);

  controlsGen();

  document.body.appendChild(aRenderer.domElement);

  window.addEventListener('resize', onWindowResize, false);
  document.addEventListener('click', onDocumentMouseMove, false);
}

function controlsGen() {
  controls = new THREE.OrbitControls(aCamera, aRenderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.25;
  controls.screenSpacePanning = false;
  controls.minDistance = 100;
  controls.maxDistance = 1500;
  controls.maxPolarAngle = Math.PI / 2;
  controls.rotateSpeed = 0.2;
}

function onWindowResize() {
  aCamera.aspect = window.innerWidth / window.innerHeight;
  aCamera.updateProjectionMatrix();
  aRenderer.setSize( window.innerWidth, window.innerHeight );
}

function onDocumentMouseMove(theEvent) {
  theEvent.preventDefault();

  const aMouseCoords = new THREE.Vector2();
  aMouseCoords.x = (theEvent.clientX / window.innerWidth) * 2 - 1;
  aMouseCoords.y = -(theEvent.clientY / window.innerHeight) * 2 + 1;

  aRaycaster.setFromCamera(aMouseCoords, aCamera);
  const anIntersects = aRaycaster.intersectObject(aCubesGroup, true);

  if (aSelectedItem) {
    aSelectedItem.deselectVertex();
    aSelectedItem = undefined;
  }

  if (anIntersects.length > 0) {
    anIntersects.forEach(theObject => {
      if (theObject.object && theObject.object instanceof THREE.Points) {
        aSelectedItem = theObject.object.parent;
        aSelectedItem.selectVertex(theObject.index);
        return;
      }
    });
  }

}

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  aRenderer.render(aScene, aCamera);
}