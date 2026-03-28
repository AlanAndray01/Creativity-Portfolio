import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { expose } from 'comlink';
import type { QualityPreset } from '../utils/qualityPresets';

let scene: THREE.Scene;
let camera: THREE.PerspectiveCamera;
let renderer: THREE.WebGLRenderer;
let group: THREE.Group;
let textMesh: THREE.Mesh;
let animationFrameId: number;

let mouseX = 0;
let mouseY = 0;

const api = {
  init: (canvas: OffscreenCanvas, width: number, height: number, pixelRatio: number, preset: QualityPreset | null) => {

    const nearDist = 0.1;
    const farDist = 10000;

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, width / height, nearDist, farDist);
    camera.position.z = 500;

    const finalPixelRatio = preset?.pixelRatio ?? Math.min(pixelRatio, 2);
    const antialias = preset?.antialias ?? true;

    renderer = new THREE.WebGLRenderer({ canvas, antialias });
    renderer.setClearColor("#4DD0E1");
    renderer.setPixelRatio(finalPixelRatio);
    renderer.setSize(width, height, false);

    // Lights
    const ambientLightIntensity = preset?.ambientLightIntensity ?? 0.64;
    const directionalLightIntensity = preset?.directionalLightIntensity ?? 1.1;
    const ambientLight = new THREE.AmbientLight(0xffffff, ambientLightIntensity);
    scene.add(ambientLight);
    const dirLight = new THREE.DirectionalLight(0xfff0f0, directionalLightIntensity);
    dirLight.position.set(200, 400, 300);
    scene.add(dirLight);

    // Bubbles
    const bubbleSize = 60;
    const sphereSegments = (preset?.sphereSegments ?? 32) * 1.5;
    const geometry = new THREE.SphereGeometry(bubbleSize, sphereSegments, sphereSegments);
    const material = new THREE.MeshNormalMaterial();
    group = new THREE.Group();
    const bubbleCount = preset?.bubbleCount ?? 350;
    for (let i = 0; i < bubbleCount; i++) {
      const mesh = new THREE.Mesh(geometry, material);
      const dist = farDist / 3;
      const distDouble = dist * 2;
      mesh.position.set(
        Math.random() * distDouble - dist,
        Math.random() * distDouble - dist,
        Math.random() * distDouble - dist
      );
      mesh.rotation.set(
        Math.random() * 2 * Math.PI,
        Math.random() * 2 * Math.PI,
        Math.random() * 2 * Math.PI
      );
      mesh.matrixAutoUpdate = false;
      mesh.updateMatrix();
      group.add(mesh);
    }
    scene.add(group);

    // Typography
    const loader = new FontLoader();
    textMesh = new THREE.Mesh();
    loader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', (font) => {
      const cubeSize = 120;
      const typoProperties = {
        font: font,
        size: cubeSize,
        height: cubeSize / 2,
        curveSegments: preset?.textCurveSegments ?? 12,
        bevelEnabled: true,
        bevelThickness: 10,
        bevelSize: 6,
        bevelOffset: 1,
        bevelSegments: preset?.textBevelSegments ?? 8,
      };

      const text1 = new TextGeometry("We build", typoProperties);
      text1.computeBoundingBox();
      const mesh1 = new THREE.Mesh(text1, material);
      if (text1.boundingBox) {
        mesh1.position.x = -0.5 * (text1.boundingBox.max.x - text1.boundingBox.min.x);
      }
      mesh1.position.y = cubeSize * 0.6;

      const text2 = new TextGeometry("Creativity.", typoProperties);
      text2.computeBoundingBox();
      const mesh2 = new THREE.Mesh(text2, material);
      if (text2.boundingBox) {
        mesh2.position.x = -0.5 * (text2.boundingBox.max.x - text2.boundingBox.min.x);
      }
      mesh2.position.y = -cubeSize * 0.6;

      textMesh.add(mesh1, mesh2);
      textMesh.position.z = -cubeSize;
      scene.add(textMesh);
    });

    const render = () => {
      const t = Date.now() * 0.001;
      const rx = Math.sin(t * 0.7) * 0.5;
      const ry = Math.sin(t * 0.3) * 0.5;
      const rz = Math.sin(t * 0.2) * 0.5;

      camera.position.x += (mouseX - camera.position.x) * 0.05;
      camera.position.y += (-mouseY - camera.position.y) * 0.05;
      camera.lookAt(scene.position);

      group.rotation.set(rx, ry, rz);

      if (textMesh) {
        const textRotationMultiplier = preset?.textRotationMultiplier ?? 0.25;
        textMesh.rotation.x = rx * textRotationMultiplier;
        textMesh.rotation.y = ry * textRotationMultiplier;
        textMesh.rotation.z = rz * textRotationMultiplier;
      }

      renderer.render(scene, camera);
      animationFrameId = self.requestAnimationFrame(render);
    };

    render();
  },
  onMouseMove: (x: number, y: number) => {
    mouseX = x;
    mouseY = y;
  },
  onResize: (width: number, height: number) => {
    if (camera && renderer) {
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    }
  },
  cleanup: () => {
    self.cancelAnimationFrame(animationFrameId);
    // You might need to dispose of geometries, materials, etc.
  },
};

expose(api);

export type ThreeWorkerApi = typeof api;
