// Ensure ThreeJS is in global scope for the 'examples/'
global.THREE = require("three");

// Include any additional ThreeJS examples below
require("three/examples/js/controls/OrbitControls");

const canvasSketch = require("canvas-sketch");
const { Plane, PlaneGeometry, Scene } = require("three");

const settings = {
  // Make the loop animated
  animate: true,
  // Get a WebGL canvas rather than 2D
  context: "webgl",
  // Scale to View
  scaleToView: true
};
const sketch = ({ context }) => {
  // Create a renderer
  //const canvas = document.querySelector('#c');
  const renderer = new THREE.WebGLRenderer({
    canvas: context.canvas,
    alpha: true
  });

  // WebGL background color
  renderer.setClearColor("#121212", 1);

  // Setup a camera
  const camera = new THREE.PerspectiveCamera(50, 1, 0.01, 100);
  camera.position.set(0, 0, -4);
  camera.lookAt(new THREE.Vector3());

  // Setup camera controller
  const controls = new THREE.OrbitControls(camera, context.canvas);

  // Setup your scene
  const scene = new THREE.Scene();
  scene.background = new THREE.Color("rgb(255,255,255)");
  // Setup a geometry
  const objectGroup = new THREE.Group();
  scene.add(objectGroup);
  console.log(scene);
  const geometry = new THREE.SphereGeometry(1, 32, 16);
  const newPlane = new PlaneGeometry(5, 3, 2, 1);

  // Setup a material
  const material = new THREE.MeshBasicMaterial({
    color: "blue",
    wireframe: true
  });

  const solidMaterial = new THREE.MeshBasicMaterial({
    color: "blue"
  });

  // Setup a mesh with geometry + material
  const mesh = new THREE.Mesh(geometry, material);
  objectGroup.add(mesh);
  const newMesh = new THREE.Mesh(newPlane, solidMaterial);
  newMesh.name = Plane;
  newMesh.material.side = THREE.DoubleSide;
  objectGroup.add(newMesh);

  // LIGHTING
  const light = new THREE.DirectionalLight("white", 1);
  light.position.set(2, 10, 2);
  light.target.position.set(-5, 0, 0);
  light.castShadow = true;
  scene.add(light);
  scene.add(light.target);

  //HELPERS
  scene.add(new THREE.PointLightHelper(light, 1));
  scene.add(new THREE.GridHelper(50, 50));

  //CONTROLS
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  window.addEventListener("mousemove", onMouseMove, false);
  window.addEventListener("pointerdown", onMouseDown, false);

  function onMouseMove(event) {
    // calculate mouse position in normalized device coordinates
    // (-1 to +1) for both components
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  }

  function onMouseDown(event) {
    console.log("Selected");
    // update the picking ray with the camera and mouse position
    raycaster.setFromCamera(mouse, camera);

    // calculate objects intersecting the picking ray
    const intersects = raycaster.intersectObjects(scene.children);
    console.log(intersects);
    for (let i = 0; i < scene.children[0].children.length; i++) {
      if (scene.children[0].children[i] == intersects[0].object) {
        scene.children[0].children[i].material.color.set("blue");
      } else {
        scene.children[0].children[i].material.color.set("red");
      }
    }
  }

  // draw each frame
  return {
    // Handle resize events here
    resize({ pixelRatio, viewportWidth, viewportHeight }) {
      renderer.setPixelRatio(pixelRatio);
      renderer.setSize(viewportWidth, viewportHeight, false);
      camera.aspect = viewportWidth / viewportHeight;
      camera.updateProjectionMatrix();
    },
    // Update & render your scene here
    render({ time }) {
      // update the picking ray with the camera and mouse position
      raycaster.setFromCamera(mouse, camera);

      // calculate objects intersecting the picking ray
      const intersects = raycaster.intersectObjects(scene.children);

      for (let i = 0; i < scene.children[0].children.length; i++) {
        if (scene.children[0].children[i] == intersects[0].object) {
          scene.children[0].children[i].material.color.set("yellow");
        } else {
          scene.children[0].children[i].material.color.set("red");
        }
      }

      controls.update();
      renderer.render(scene, camera);
    },
    // Dispose of events & renderer for cleaner hot-reloading
    unload() {
      controls.dispose();
      renderer.dispose();
    }
  };
};

canvasSketch(sketch, settings);
