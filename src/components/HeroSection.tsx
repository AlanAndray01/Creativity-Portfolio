'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import gsap from 'gsap';
import './HeroSection.css';

export default function HeroSection() {
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    // Scene setup
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const dat = require('dat.gui');
    const scene = new THREE.Scene();
    
    // Responsive camera settings
    const getResponsiveCamera = () => {
      const width = window.innerWidth;
      let fov = 25;
      let zPos = 24;
      
      if (width < 480) {
        // Mobile: small phones
        fov = 40;
        zPos = 25;
      } else if (width < 768) {
        // Mobile: larger phones
        fov = 35;
        zPos = 25;
      } else if (width < 1024) {
        // Tablet
        fov = 28;
        zPos = 26;
      }
      
      return { fov, zPos };
    };
    
    const { fov, zPos } = getResponsiveCamera();
    const camera = new THREE.PerspectiveCamera(fov, window.innerWidth / window.innerHeight, 0.1, 1000);

    camera.position.z = zPos;

      const renderer = new THREE.WebGLRenderer({
        canvas: document.querySelector('#webgl') as HTMLCanvasElement,
        antialias: true,
        alpha: true
      });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;

      // Add RoomEnvironment for ultra-realistic soft lighting
      const pmremGenerator = new THREE.PMREMGenerator(renderer);
      pmremGenerator.compileEquirectangularShader();
      scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;

      
      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.05;
      controls.autoRotate = false;
      controls.autoRotateSpeed = 0;
      controls.enableZoom = false;
      controls.enablePan = false;
      controls.enableRotate = false;
      controls.target.set(0, 0, 0);
      controls.update();

      const radii = [1, 0.6, 0.8, 0.4, 0.9, 0.7, 0.9, 0.3, 0.2, 0.5, 0.6, 0.4, 0.5, 0.6, 0.7, 0.3, 0.4, 0.8, 0.7, 0.5, 0.4, 0.6, 0.35, 0.38, 0.9, 0.3, 0.6, 0.4, 0.2, 0.35, 0.5, 0.15, 0.2, 0.25, 0.4, 0.8, 0.76, 0.8, 1, 0.8, 0.7, 0.8, 0.3, 0.5, 0.6, 0.55, 0.42, 0.75, 0.66, 0.6, 0.7, 0.5, 0.6, 0.35, 0.35, 0.35, 0.8, 0.6, 0.7, 0.8, 0.4, 0.89, 0.3, 0.3, 0.6, 0.4, 0.2, 0.52, 0.5, 0.15, 0.2, 0.25, 0.4, 0.8, 0.76, 0.8, 1, 0.8, 0.7, 0.8, 0.3, 0.5, 0.6, 0.8, 0.7, 0.75, 0.66, 0.6, 0.7, 0.5, 0.6, 0.35, 0.35, 0.35, 0.8, 0.6, 0.7, 0.8, 0.4, 0.89, 0.3];

      const positions = [
        {x:0,y:0,z:0}, {x:1.2,y:0.9,z:-0.5}, {x:1.8,y:-0.3,z:0}, {x:-1,y:-1,z:0}, {x:-1,y:1.62,z:0}, {x:-1.65,y:0,z:-0.4}, {x:-2.13,y:-1.54,z:-0.4}, {x:0.8,y:0.94,z:0.3}, {x:0.5,y:-1,z:1.2}, {x:-0.16,y:-1.2,z:0.9}, {x:1.5,y:1.2,z:0.8}, {x:0.5,y:-1.58,z:1.4}, {x:-1.5,y:1,z:1.15}, {x:-1.5,y:-1.5,z:0.99}, {x:-1.5,y:-1.5,z:-1.9}, {x:1.85,y:0.8,z:0.05}, {x:1.5,y:-1.2,z:-0.75}, {x:0.9,y:-1.62,z:0.22}, {x:0.45,y:2,z:0.65}, {x:2.5,y:1.22,z:-0.2}, {x:2.35,y:0.7,z:0.55}, {x:-1.8,y:-0.35,z:0.85}, {x:-1.02,y:0.2,z:0.9}, {x:0.2,y:1,z:1}, {x:-2.88,y:0.7,z:1}, {x:-2,y:-0.95,z:1.5}, {x:-2.3,y:2.4,z:-0.1}, {x:-2.5,y:1.9,z:1.2}, {x:-1.8,y:0.37,z:1.2}, {x:-2.4,y:1.42,z:0.05}, {x:-2.72,y:-0.9,z:1.1}, {x:-1.8,y:-1.34,z:1.67}, {x:-1.6,y:1.66,z:0.91}, {x:-2.8,y:1.58,z:1.69}, {x:-2.97,y:2.3,z:0.65}, {x:1.1,y:-0.2,z:-1.45}, {x:-4,y:1.78,z:0.38}, {x:0.12,y:1.4,z:-1.29}, {x:-1.64,y:1.4,z:-1.79}, {x:-3.5,y:-0.58,z:0.1}, {x:-0.1,y:-1,z:-2}, {x:-4.5,y:0.55,z:-0.5}, {x:-3.87,y:0,z:1}, {x:-4.6,y:-0.1,z:0.65}, {x:-3,y:1.5,z:-0.7}, {x:-0.5,y:0.2,z:-1.5}, {x:-1.3,y:-0.45,z:-1.5}, {x:-3.35,y:0.25,z:-1.5}, {x:-4.76,y:-1.26,z:0.4}, {x:-4.32,y:0.85,z:1.4}, {x:-3.5,y:-1.82,z:0.9}, {x:-3.6,y:-0.6,z:1.46}, {x:-4.55,y:-1.5,z:1.63}, {x:-3.8,y:-1.15,z:2.1}, {x:-2.9,y:-0.25,z:1.86}, {x:-2.2,y:-0.4,z:1.86}, {x:-5.1,y:-0.24,z:1.86}, {x:-5.27,y:1.24,z:0.76}, {x:-5.27,y:2,z:-0.4}, {x:-6.4,y:0.4,z:1}, {x:-5.15,y:0.95,z:2}, {x:-6.2,y:0.5,z:-0.8}, {x:-4,y:0.08,z:1.8}, {x:2,y:-0.95,z:1.5}, {x:2.3,y:2.4,z:-0.1}, {x:2.5,y:1.9,z:1.2}, {x:1.8,y:0.37,z:1.2}, {x:3.24,y:0.6,z:1.05}, {x:2.72,y:-0.9,z:1.1}, {x:1.8,y:-1.34,z:1.67}, {x:1.6,y:1.99,z:0.91}, {x:2.8,y:1.58,z:1.69}, {x:2.97,y:2.3,z:0.65}, {x:-1.3,y:-0.2,z:-2.5}, {x:4,y:1.78,z:0.38}, {x:1.72,y:1.4,z:-1.29}, {x:2.5,y:-1.2,z:-2}, {x:3.5,y:-0.58,z:0.1}, {x:0.1,y:0.4,z:-2.42}, {x:4.5,y:0.55,z:-0.5}, {x:3.87,y:0,z:1}, {x:4.6,y:-0.1,z:0.65}, {x:3,y:1.5,z:-0.7}, {x:2.3,y:0.6,z:-2.6}, {x:4,y:1.5,z:-1.6}, {x:3.35,y:0.25,z:-1.5}, {x:4.76,y:-1.26,z:0.4}, {x:4.32,y:0.85,z:1.4}, {x:3.5,y:-1.82,z:0.9}, {x:3.6,y:-0.6,z:1.46}, {x:4.55,y:-1.5,z:1.63}, {x:3.8,y:-1.15,z:2.1}, {x:2.9,y:-0.25,z:1.86}, {x:2.2,y:-0.4,z:1.86}, {x:5.1,y:-0.24,z:1.86}, {x:5.27,y:1.24,z:0.76}, {x:5.27,y:2,z:-0.4}, {x:6.4,y:0.4,z:1}, {x:5.15,y:0.95,z:2}, {x:6.2,y:0.5,z:-0.8}, {x:4,y:0.08,z:1.8}
      ];

const gui = new dat.GUI({ closed: true });
gui.close(); // Double ensure it's closed by default

      // Helper function to convert hex to RGB
      const hexToRgb = (hex: string): string => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : '202, 112, 0';
      };

      // Helper function to update CSS variables for About Section bubble
      const updateBubbleStyles = () => {
        const root = document.documentElement;
        root.style.setProperty('--bubble-primary-color', params.color);
        root.style.setProperty('--bubble-emissive-color', params.emissive);
        root.style.setProperty('--bubble-shadow-rgb', hexToRgb(params.color));
        root.style.setProperty('--bubble-roughness', String(params.roughness));
        root.style.setProperty('--bubble-metalness', String(params.metalness));
        root.style.setProperty('--bubble-clearcoat', String(params.clearcoat));
      };

const params = {
  color: '#ca7000',
        emissive: '#070505',
        roughness: 0.35,
        metalness: 0.148,
        clearcoat: 0.31,
        ambientLight: 0.8,
        directionalLight: 1.07
      };

      const material = new THREE.MeshPhysicalMaterial({
        color: params.color,
        emissive: params.emissive,
        roughness: params.roughness,
        metalness: params.metalness,
        clearcoat: params.clearcoat,
        clearcoatRoughness: 0.2,
      });

      // Initialize CSS variables with default values
      updateBubbleStyles();

      const guiMaterial = gui.addFolder('Material');
      guiMaterial.addColor(params, 'color').onChange((v: string) => {
        material.color.set(v);
        updateBubbleStyles();
      });
      guiMaterial.addColor(params, 'emissive').onChange((v: string) => {
        material.emissive.set(v);
        updateBubbleStyles();
      });
      guiMaterial.add(params, 'roughness', 0, 1).onChange((v: number) => {
        material.roughness = v;
        updateBubbleStyles();
      });
      guiMaterial.add(params, 'metalness', 0, 1).onChange((v: number) => {
        material.metalness = v;
        updateBubbleStyles();
      });
      guiMaterial.add(params, 'clearcoat', 0, 1).onChange((v: number) => {
        material.clearcoat = v;
        updateBubbleStyles();
      });
      // guiMaterial.open();

      const group = new THREE.Group();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const spheres: any[] = [];

      positions.forEach((pos, i) => {
        const radius = radii[i];
        const geometry = new THREE.SphereGeometry(radius, 64, 64);
        const sphere = new THREE.Mesh(geometry, material);
        sphere.position.set(pos.x, pos.y, pos.z);
        sphere.userData = {originalPosition: {...pos}, radius};
        sphere.castShadow = true;
        sphere.receiveShadow = true;
        spheres.push(sphere);
        group.add(sphere);
      });

      scene.add(group);

      const handleResize = () => {
        const width = window.innerWidth;
        const height = window.innerHeight;
        
        // Update Camera
        const camSettings = getResponsiveCamera();
        camera.fov = camSettings.fov;
        camera.position.z = camSettings.zPos;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();

        // Update Group Scale for Mobile
        if (width < 480) {
          group.scale.set(0.6, 0.6, 0.6);
        } else if (width < 768) {
          group.scale.set(0.85, 0.85, 0.85);
        } else if (width < 1024) {
          group.scale.set(0.95, 0.95, 0.95);
        } else {
          group.scale.set(1, 1, 1);
        }

        renderer.setSize(width, height);
      };

      // Call first time
      handleResize();
      window.addEventListener('resize', handleResize);

      // Enhance soft shadows and warm light
      const ambientLight = new THREE.AmbientLight(0xffffff, params.ambientLight);
      scene.add(ambientLight);

      const dirLight = new THREE.DirectionalLight(0xfff0f0, params.directionalLight); // Slight warm tint
      dirLight.position.set(10, 20, 15);
      dirLight.castShadow = true;
      dirLight.shadow.mapSize.width = 1024;
      dirLight.shadow.mapSize.height = 1024;
      dirLight.shadow.bias = -0.0001;
      scene.add(dirLight);

      const hemiLight = new THREE.HemisphereLight(0xffffff, 0xffe6f0, 0.4);
      scene.add(hemiLight);

      const guiLights = gui.addFolder('Lights');
      guiLights.add(params, 'ambientLight', 0, 3).onChange((v: number) => { ambientLight.intensity = v; });
      guiLights.add(params, 'directionalLight', 0, 3).onChange((v: number) => { dirLight.intensity = v; });
      // guiLights.open();

      gui.close(); // Close the GUI by default

      const raycaster = new THREE.Raycaster();
      const mouse = new THREE.Vector2();
      const tempVector = new THREE.Vector3();
      const forces = new Map();

      const initY = -25;
      const revolutionRadius = 4;
      const revolutionDuration = 1.7;  // Reduced from 2 to 0.7 seconds
      const breathingAmplitude = 0.1;
      const breathingSpeed = 0.002;

      spheres.forEach(sphere => {
        sphere.position.y = initY;
      });

      let loadingComplete = false;

      const initLoadingAnimation = () => {
        spheres.forEach((sphere, i) => {
          const delay = i * 0.02;
          gsap.timeline()
            .to(sphere.position, {
              duration: revolutionDuration / 2,
              y: revolutionRadius,
              ease: 'power1.out',
              onUpdate: function() {
                const progress = this.progress();
                sphere.position.z = sphere.userData.originalPosition.z + Math.sin(progress * Math.PI) * revolutionRadius;
              },
              delay: delay
            })
            .to(sphere.position, {
              duration: revolutionDuration / 2,
              y: initY / 5,
              ease: 'power1.out',
              onUpdate: function() {
                const progress = this.progress();
                sphere.position.z = sphere.userData.originalPosition.z - Math.sin(progress * Math.PI) * revolutionRadius;
              }
            })
            .to(sphere.position, {
              duration: 0.6,
              x: sphere.userData.originalPosition.x,
              y: sphere.userData.originalPosition.y,
              z: sphere.userData.originalPosition.z,
              ease: 'power1.out'
            });
        });
      };

      initLoadingAnimation();

      const hiddenElements = document.querySelectorAll('.hide-text');
      const mainTxt = document.querySelector('.main-txt');
      const mouseEffect = document.querySelector('.mouse-effect');

      hiddenElements.forEach(el => {
        (el as HTMLElement).style.opacity = '0';
      });

      setTimeout(() => {
        loadingComplete = true;
        hiddenElements.forEach(el => {
          (el as HTMLElement).style.opacity = '1';
        });
        if (mainTxt) (mainTxt as HTMLElement).style.opacity = '0';
      }, (revolutionDuration + 1) * 1000);

      gsap.set('.circle', {xPercent: -50, yPercent: -50});
      gsap.set('.circle-follow', {xPercent: -50, yPercent: -50});

      const xTo = gsap.quickTo('.circle', 'x', {duration: 0.6, ease: 'power3'});
      const yTo = gsap.quickTo('.circle', 'y', {duration: 0.6, ease: 'power3'});
      const xFollow = gsap.quickTo('.circle-follow', 'x', {duration: 0.6, ease: 'power3'});
      const yFollow = gsap.quickTo('.circle-follow', 'y', {duration: 0.6, ease: 'power3'});

      const onMouseMove = (event: MouseEvent) => {
        if (!loadingComplete) return;
        xTo(event.clientX);
        yTo(event.clientY);
        xFollow(event.clientX);
        yFollow(event.clientY);
        if (mouseEffect) (mouseEffect as HTMLElement).style.opacity = '1';

        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(spheres);

        if (intersects.length > 0) {
          const hoveredSphere = intersects[0].object;
          const force = new THREE.Vector3();
          force.subVectors(intersects[0].point, hoveredSphere.position).normalize().multiplyScalar(0.2);
          forces.set(hoveredSphere.uuid, force);
        }
      };

      const handleCollisions = () => {
        for (let i = 0; i < spheres.length; i++) {
          const sphereA = spheres[i];
          const radiusA = sphereA.userData.radius;

          for (let j = i + 1; j < spheres.length; j++) {
            const sphereB = spheres[j];
            const radiusB = sphereB.userData.radius;

            const distance = sphereA.position.distanceTo(sphereB.position);
            const minDistance = (radiusA + radiusB) * 1.2;

            if (distance < minDistance) {
              tempVector.subVectors(sphereB.position, sphereA.position).normalize();
              const pushStrength = (minDistance - distance) * 0.4;
              sphereA.position.sub(tempVector.clone().multiplyScalar(pushStrength));
              sphereB.position.add(tempVector.multiplyScalar(pushStrength));
            }
          }
        }
      };

      const animate = () => {
        requestAnimationFrame(animate);

        if (loadingComplete) {
          const time = Date.now() * breathingSpeed;
          spheres.forEach((sphere, i) => {
            const offset = i * 0.2;
            const breathingY = Math.sin(time + offset) * breathingAmplitude;
            const breathingZ = Math.cos(time + offset) * breathingAmplitude * 0.5;

            const force = forces.get(sphere.uuid);
            if (force) {
              sphere.position.add(force);
              force.multiplyScalar(0.95);
              if (force.length() < 0.01) forces.delete(sphere.uuid);
            }

            const originalPos = sphere.userData.originalPosition;
            tempVector.set(originalPos.x, originalPos.y + breathingY, originalPos.z + breathingZ);
            sphere.position.lerp(tempVector, 0.018);
          });

          handleCollisions();
        }

        controls.update();
        renderer.render(scene, camera);
      };

      window.addEventListener('mousemove', onMouseMove);
      animate();

      return () => {
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('resize', handleResize);
        gui.destroy();
        // We could also dispose of renderer, etc.
      };
  }, []);

  return (
    <>
      <div className="hero-section-container">
        <div className="mouse-effect">
          <div className="circle"></div>
          <div className="circle-follow"></div>
        </div>

        <header className="hide-text">
          <div className="header-inner">
            <a href="#" className="navbar-brand">Creativity</a>
            <nav>
              <ul>
                <li><a href="#">octane</a></li>
                <li><a href="#">cinema 4d</a></li>
                <li><a href="#">dynamics</a></li>
                <li><a href="#">Collisions</a></li>
                <li><a href="#">simulations</a></li>
              </ul>
            </nav>
            <button className="ham-btn">
              <i className="fa-solid fa-bars"></i>
            </button>
          </div>
        </header>

        <h1 className="main-txt">Creativity</h1>

        <section className="banner hide-text">
          <div className="banner-inner">
            <div className="top-desc">
              <h5>Despersion Collisions</h5>
              <h6>Research & Development</h6>
              <span></span>
            </div>
            <div className="bottom-desc">
              <div className="left-desc">
                <h1>X</h1>
                <div className="desc-inner">
                  <h5>Pink & Rose Gold</h5>
                  <h6>Lighting & Material Study</h6>
                </div>
              </div>
              <div className="middle-desc">
                <h2>Dynamic Collisions</h2>
              </div>
              <div className="right-desc">
                <h1>01</h1>
                <div className="desc-inner">
                  <span>Social Links</span>
                  <ul>
                    <li><a href="#"><i className="fa-brands fa-x-twitter"></i></a></li>
                    <li><a href="#"><i className="fa-brands fa-facebook-f"></i></a></li>
                    <li><a href="#"><i className="fa-brands fa-instagram"></i></a></li>
                    <li><a href="#"><i className="fa-brands fa-youtube"></i></a></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        <span className="rotated-text hide-text">Drag cursor to perfect</span>
        <canvas className="webgl" id="webgl"></canvas>
      </div>
    </>
  );
}
