/* Demo JS */
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';
import { gsap } from 'gsap';
import { DoubleSide, EquirectangularRefractionMapping } from 'three';
import { AnimationUtils } from 'three';

const canvas = document.querySelector('.canvas');
let lineCount = 1000;
let geom = new THREE.BufferGeometry();
geom.setAttribute("position", new THREE.BufferAttribute(new Float32Array(6*lineCount), 3));
geom.setAttribute("velocity", new THREE.BufferAttribute(new Float32Array(2*lineCount), 1));
let pos = geom.getAttribute("position");
let positions = pos.array;
let vel = geom.getAttribute("velocity");
let velocity = vel.array;
let x, y, z;

const renderer = new THREE.WebGLRenderer({ antialias: true, canvas: canvas });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000);

const scene = new THREE.Scene();

let camera = new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight, 1, 500);

// Camera positioning
camera.position.z = 200;
for (let i= 0; i < lineCount; i++) {
   x = Math.random() * 400 - 200;
   y = Math.random() * 200 - 100;
   z = Math.random() * 500 - 100;

  positions[6*i] = x;
  positions[6*i+1] = y;
  positions[6*i+2] = z;

  positions[6*i+3] = x;
  positions[6*i+4] = y;
  positions[6*i+5] = z;

  velocity[2*i] = velocity[2*i+1] = 0;
}
//debugger;
let mat = new THREE.LineBasicMaterial({color: 0xffffff});
let lines = new THREE.LineSegments(geom, mat);
scene.add(lines);


function animate() {
  for (let i= 0; i < lineCount; i++) {
    velocity[2*i] += 0.03;
    velocity[2*i+1] += 0.025;

    positions[6*i+2] += velocity[2*i];  
    positions[6*i+5] += velocity[2*i+1];

    if(positions[6*i+5] > 200) {
        var z= Math.random() * 200 - 100;
        positions[6*i+2] = z;
        positions[6*i+5] = z;
        velocity[2*i] = 0;
        velocity[2*i+1] = 0;
    }
  }
  pos.needsUpdate = true;
  
  renderer.render(scene, camera);
  renderer.setAnimationLoop(animate);
}

animate();

window.addEventListener('resize', resizeEvent);

function resizeEvent() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
