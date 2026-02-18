/* ============================================================
   THREE.JS: DEVOPS BACKGROUND + ANUSYS ROBOT
   ============================================================ */

// 1. SETUP
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 7; // Maintained your portfolio camera depth

const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById("webgl-bg").appendChild(renderer.domElement);

// 2. LIGHTING
// Your existing Lime Green Light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xccff00, 1.2);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

// Robot's specific Orange Light (Positioned near the robot)
const robotLight = new THREE.PointLight(0xff5e00, 3, 15);
robotLight.position.set(4, 2, 2);
scene.add(robotLight);

// 3. BACKGROUND PARTICLES (Your Original Code)
const particlesGeometry = new THREE.BufferGeometry();
const particleCount = 900;
const posArray = new Float32Array(particleCount * 3);

for (let i = 0; i < particleCount * 3; i++) {
  posArray[i] = (Math.random() - 0.5) * 25;
}
particlesGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(posArray, 3)
);
const particlesMaterial = new THREE.PointsMaterial({
  size: 0.035,
  color: 0xccff00,
  transparent: true,
  opacity: 0.7,
});
const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particlesMesh);

// 4. FLOATING CUBES (Your Original Code)
const cubeGroup = new THREE.Group();
scene.add(cubeGroup);
const cubeCount = 45;

for (let i = 0; i < cubeCount; i++) {
  const geometry = new THREE.BoxGeometry(
    Math.random() * 0.5 + 0.2,
    Math.random() * 0.5 + 0.2,
    Math.random() * 0.5 + 0.2
  );
  const material = new THREE.MeshStandardMaterial({
    color: 0x111111,
    emissive: 0xccff00,
    emissiveIntensity: 0.25,
    metalness: 0.8,
    roughness: 0.3,
  });
  const cube = new THREE.Mesh(geometry, material);
  cube.position.x = (Math.random() - 0.5) * 14;
  cube.position.y = (Math.random() - 0.5) * 14;
  cube.position.z = (Math.random() - 0.5) * 14;
  cube.userData = {
    speedX: (Math.random() - 0.5) * 0.01,
    speedY: (Math.random() - 0.5) * 0.01,
    rotX: Math.random() * 0.02,
    rotY: Math.random() * 0.02,
  };
  cubeGroup.add(cube);
}

// 5. THE ROBOT ASSEMBLY (Injected)
const robot = new THREE.Group();

// Head
const headGeo = new THREE.BoxGeometry(3, 2.6, 2.6);
const headMat = new THREE.MeshStandardMaterial({
  color: 0x080808,
  roughness: 0.2,
  metalness: 0.9,
});
const head = new THREE.Mesh(headGeo, headMat);
robot.add(head);

// Face Screen
const screenGeo = new THREE.PlaneGeometry(2.7, 2.2);
const screenMat = new THREE.MeshBasicMaterial({
  color: 0x111111,
  transparent: true,
  opacity: 0.95,
});
const screen = new THREE.Mesh(screenGeo, screenMat);
screen.position.z = 1.31;
robot.add(screen);

// Eyes
const eyeGeo = new THREE.PlaneGeometry(0.5, 0.5);
const eyeMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
leftEye.position.set(-0.6, 0.2, 1.32);
robot.add(leftEye);
const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
rightEye.position.set(0.6, 0.2, 1.32);
robot.add(rightEye);

// Smile
const mouthGeo = new THREE.TorusGeometry(0.4, 0.04, 16, 100, Math.PI);
const mouthMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
const mouth = new THREE.Mesh(mouthGeo, mouthMat);
mouth.position.set(0, -0.4, 1.32);
mouth.rotation.set(0, 0, Math.PI);
robot.add(mouth);

// Glowing Orange Rims (Kept orange to contrast with your Lime theme)
const rimGeo = new THREE.BoxGeometry(3.1, 2.7, 2.7);
const rimMat = new THREE.MeshBasicMaterial({
  color: 0xff5e00,
  wireframe: true,
  transparent: true,
  opacity: 0.3,
});
const rim = new THREE.Mesh(rimGeo, rimMat);
robot.add(rim);

// Antennas
const antGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.4);
const antMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
const antL = new THREE.Mesh(antGeo, antMat);
antL.position.set(-1, 1.4, 0);
antL.rotation.z = -0.3;
robot.add(antL);
const antR = new THREE.Mesh(antGeo, antMat);
antR.position.set(1, 1.4, 0);
antR.rotation.z = 0.3;
robot.add(antR);

// POSITIONING THE ROBOT
// Your camera is at z=7, so we scale the robot down slightly to fit well.
robot.scale.set(0.65, 0.65, 0.65);
robot.position.set(3.5, 0.5, 0); // Moved to the right side
scene.add(robot);

// 6. MOUSE INTERACTION
let mouseX = 0;
let mouseY = 0;

document.addEventListener("mousemove", (event) => {
  mouseX = event.clientX / window.innerWidth - 0.5;
  mouseY = event.clientY / window.innerHeight - 0.5;
});

// 7. ANIMATION LOOP
function animate() {
  requestAnimationFrame(animate);

  // -- Background Animation --
  particlesMesh.rotation.y += 0.0008;

  cubeGroup.children.forEach((cube) => {
    cube.rotation.x += cube.userData.rotX;
    cube.rotation.y += cube.userData.rotY;
    cube.position.x += cube.userData.speedX;
    cube.position.y += cube.userData.speedY;

    if (cube.position.x > 7 || cube.position.x < -7) cube.userData.speedX *= -1;
    if (cube.position.y > 7 || cube.position.y < -7) cube.userData.speedY *= -1;
  });

  cubeGroup.rotation.y += mouseX * 0.02;
  cubeGroup.rotation.x += mouseY * 0.02;

  // -- Robot Animation --
  // Float
  robot.position.y = 0.5 + Math.sin(Date.now() * 0.0015) * 0.2;
  
  // Rotate based on mouse (Linked to your existing mouse logic)
  robot.rotation.y = mouseX * 0.5;
  robot.rotation.x = mouseY * 0.3;

  // Mouth Pulse
  const pulse = 1 + Math.sin(Date.now() * 0.005) * 0.05;
  mouth.scale.set(pulse, pulse, 1);

  renderer.render(scene, camera);
}

animate();

// 8. RESIZE HANDLER
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});