import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

const checkModelExists = async (path: string): Promise<boolean> => {
  try {
    const response = await fetch(path);
    return response.ok;
  } catch (error) {
    console.error("Model path check failed:", error);
    return false;
  }
};

export const initializeScene = async (divId: string) => {
  if (typeof window === "undefined") return; // Make sure we're on the client-side

  const container = document.getElementById(divId);
  if (!container) return;

  const modelPath = "./Truck/Truck.gltf"; // Your GLTF model path

  const modelExists = await checkModelExists(modelPath);
  if (!modelExists) {
    console.error(
      "GLTF model does not exist at the specified path:",
      modelPath,
    );
    return;
  }

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    0.1,
    1000,
  );
  camera.position.set(0, 1, 5);

  const renderer = new THREE.WebGLRenderer({ alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(10, 10, 10);
  scene.add(directionalLight);

  const loader = new GLTFLoader();
  loader.load(modelPath, (gltf) => {
    const truck = gltf.scene;
    truck.scale.set(0.5, 0.5, 0.5);
    scene.add(truck);

    const cursorPosition = new THREE.Vector3();
    const orbitCenter = new THREE.Vector3();
    const orbitRadius = 5;
    const orbitSpeed = 0.01;
    let orbitAngle = 0;

    const spinDistance = 0.2;
    const maxSpinSpeed = 0.02;
    const spinTransitionSpeed = 1;
    let currentSpinSpeed = 0;
    let spinAngle = 0;

    const onMouseMove = (event: MouseEvent) => {
      const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      const mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
      cursorPosition.set(mouseX * 10, mouseY * 4, -5);
    };
    window.addEventListener("mousemove", onMouseMove);

    const updateTruck = () => {
      orbitCenter.lerp(cursorPosition, 0.1);

      const orbitX = Math.cos(orbitAngle) * orbitRadius;
      const orbitZ = Math.sin(orbitAngle) * orbitRadius;
      const targetPosition = new THREE.Vector3(
        orbitCenter.x + orbitX,
        orbitCenter.y,
        orbitCenter.z + orbitZ,
      );

      truck.position.lerp(targetPosition, 0.005);

      orbitAngle += orbitSpeed;

      const distanceToCursor = truck.position.distanceTo(cursorPosition);

      if (distanceToCursor <= spinDistance) {
        currentSpinSpeed = THREE.MathUtils.lerp(
          currentSpinSpeed,
          maxSpinSpeed,
          spinTransitionSpeed,
        );
      } else {
        currentSpinSpeed = THREE.MathUtils.lerp(
          currentSpinSpeed,
          0,
          spinTransitionSpeed,
        );
      }

      spinAngle += currentSpinSpeed;
      truck.rotation.y = spinAngle;

      const movementDirection = new THREE.Vector3()
        .subVectors(targetPosition, truck.position)
        .normalize();

      if (currentSpinSpeed < maxSpinSpeed * 0.5) {
        const newUp = new THREE.Vector3(0, 1, 0).lerp(
          new THREE.Vector3(
            -movementDirection.z,
            0,
            movementDirection.x,
          ).normalize(),
          0.2,
        );

        const newForward = movementDirection;
        const newRight = new THREE.Vector3()
          .crossVectors(newUp, newForward)
          .normalize();
        newUp.crossVectors(newForward, newRight);

        const rotationMatrix = new THREE.Matrix4().makeBasis(
          newRight,
          newUp,
          newForward,
        );

        const spinInfluence = currentSpinSpeed / maxSpinSpeed;
        const movementQuaternion = new THREE.Quaternion().setFromRotationMatrix(
          rotationMatrix,
        );
        const spinQuaternion = new THREE.Quaternion().setFromAxisAngle(
          new THREE.Vector3(0, 1, 0),
          spinAngle,
        );
        truck.quaternion.slerpQuaternions(
          movementQuaternion,
          spinQuaternion,
          spinInfluence,
        );

        const pitchAngle =
          Math.atan2(cursorPosition.y - truck.position.y, orbitRadius) * 0.2;
        truck.rotateX(pitchAngle * (1 - spinInfluence));
      }
    };

    const animate = () => {
      requestAnimationFrame(animate);
      updateTruck();
      renderer.render(scene, camera);
    };
    animate();
  });

  const onWindowResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  };
  window.addEventListener("resize", onWindowResize);
};
