"use client";

import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js';
import { getTrajectoryPoints } from '@/lib/orbital-mechanics';
import type { CelestialBody, Planet, Asteroid } from '@/lib/celestial-data';

interface SolarSystemProps {
  sun: CelestialBody;
  planets: Planet[];
  asteroids: Asteroid[];
  isPlaying: boolean;
  animationSpeed: number;
  onAsteroidClick: (name: string) => void;
  onMetricsUpdate: (name: string, metrics: { distanceToSun: number; velocity: number; acceleration: number }) => void;
}

interface CelestialObject {
  body: THREE.Object3D;
  path: THREE.CatmullRomCurve3;
  label: CSS2DObject;
  prevPosition: THREE.Vector3;
  velocity: THREE.Vector3;
  acceleration: THREE.Vector3;
  data: Planet | Asteroid;
}

const SolarSystem: React.FC<SolarSystemProps> = ({ sun, planets, asteroids, isPlaying, animationSpeed, onAsteroidClick, onMetricsUpdate }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const state = useRef<{
    celestialObjects: Map<string, CelestialObject>;
    lastUpdateTime: number;
    clock: THREE.Clock;
  }>({
    celestialObjects: new Map(),
    lastUpdateTime: 0,
    clock: new THREE.Clock(),
  }).current;

  useEffect(() => {
    if (!mountRef.current) return;
    const mount = mountRef.current;
    
    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, mount.clientWidth / mount.clientHeight, 0.1, 1000);
    camera.position.set(0, 80, 150);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    mount.appendChild(renderer.domElement);

    const labelRenderer = new CSS2DRenderer();
    labelRenderer.setSize(mount.clientWidth, mount.clientHeight);
    labelRenderer.domElement.style.position = 'absolute';
    labelRenderer.domElement.style.top = '0px';
    labelRenderer.domElement.style.pointerEvents = 'none';
    mount.appendChild(labelRenderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0xffffff, 3, 0, 1);
    scene.add(pointLight);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    // Sun
    const sunGeometry = new THREE.SphereGeometry(sun.radius * 200, 32, 32);
    const sunMaterial = new THREE.MeshBasicMaterial({ color: sun.color, emissive: sun.color, emissiveIntensity: 1 });
    const sunMesh = new THREE.Mesh(sunGeometry, sunMaterial);
    scene.add(sunMesh);

    // Starfield
    const starVertices = [];
    for (let i = 0; i < 10000; i++) {
        const x = THREE.MathUtils.randFloatSpread(2000);
        const y = THREE.MathUtils.randFloatSpread(2000);
        const z = THREE.MathUtils.randFloatSpread(2000);
        starVertices.push(x, y, z);
    }
    const starGeometry = new THREE.BufferGeometry();
    starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
    const starMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.2 });
    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);

    // Create celestial bodies
    const allBodies = [...planets, ...asteroids];
    allBodies.forEach(bodyData => {
      const trajectoryPoints = getTrajectoryPoints(bodyData.elements);
      if (trajectoryPoints.length < 2) return;
      
      const path = new THREE.CatmullRomCurve3(trajectoryPoints, true);
      const geometry = new THREE.BufferGeometry().setFromPoints(path.getPoints(500));
      const material = new THREE.LineBasicMaterial({ color: bodyData.color, transparent: true, opacity: 0.5 });
      const trajectoryLine = new THREE.Line(geometry, material);
      scene.add(trajectoryLine);

      const sphereGeometry = new THREE.SphereGeometry(bodyData.radius * 200, 16, 16);
      const sphereMaterial = new THREE.MeshStandardMaterial({ color: bodyData.color, emissive: bodyData.color, emissiveIntensity: 0.1 });
      const bodyMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
      bodyMesh.name = bodyData.name;
      scene.add(bodyMesh);

      const labelDiv = document.createElement('div');
      labelDiv.className = 'text-white text-xs p-1 rounded-md bg-black bg-opacity-50 whitespace-nowrap';
      labelDiv.textContent = bodyData.name;
      const label = new CSS2DObject(labelDiv);
      label.position.copy(bodyMesh.position);
      bodyMesh.add(label);
      
      state.celestialObjects.set(bodyData.name, {
        body: bodyMesh,
        path,
        label,
        prevPosition: path.getPointAt(0),
        velocity: new THREE.Vector3(),
        acceleration: new THREE.Vector3(),
        data: bodyData,
      });
    });

    // Animation loop
    state.lastUpdateTime = state.clock.getElapsedTime();

    const animate = () => {
      requestAnimationFrame(animate);

      const elapsedTime = state.clock.getElapsedTime();
      const deltaTime = elapsedTime - state.lastUpdateTime;
      state.lastUpdateTime = elapsedTime;

      if (isPlaying && deltaTime > 0) {
        state.celestialObjects.forEach((obj, name) => {
          const visualSpeedMultiplier = (obj.data as Asteroid).visualSpeedMultiplier ?? 1.0;
          const time = (elapsedTime * animationSpeed * visualSpeedMultiplier) % 1;
          const position = obj.path.getPointAt(time);
          obj.body.position.copy(position);
  
          if (asteroids.some(a => a.name === name)) {
              const distanceToSun = position.length();
              
              const newVelocity = position.clone().sub(obj.prevPosition).divideScalar(deltaTime);
              if(isFinite(newVelocity.x) && isFinite(newVelocity.y) && isFinite(newVelocity.z)) {
                const newAcceleration = newVelocity.clone().sub(obj.velocity).divideScalar(deltaTime);
  
                obj.velocity.copy(newVelocity);
                if(isFinite(newAcceleration.x) && isFinite(newAcceleration.y) && isFinite(newAcceleration.z)) {
                  obj.acceleration.copy(newAcceleration);
                }
              }
              obj.prevPosition.copy(position);
  
              const velocityMagnitude = obj.velocity.length();
              const accelerationMagnitude = obj.acceleration.length();
  
              const labelDiv = obj.label.element as HTMLDivElement;
              labelDiv.innerHTML = `
                ${name}<br>
                Dist: ${distanceToSun.toFixed(2)} AU<br>
                Vel: ${velocityMagnitude.toFixed(2)} AU/s<br>
                Acc: ${accelerationMagnitude.toFixed(2)} AU/s²
              `;

              onMetricsUpdate(name, {
                distanceToSun: distanceToSun,
                velocity: velocityMagnitude,
                acceleration: accelerationMagnitude,
              });
          }
        });
      }
      
      controls.update();
      renderer.render(scene, camera);
      labelRenderer.render(scene, camera);
    };
    
    animate();
    
    // Raycasting for clicks
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    const onClick = (event: MouseEvent) => {
        const rect = renderer.domElement.getBoundingClientRect();
        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const asteroidMeshes = asteroids.map(a => state.celestialObjects.get(a.name)?.body).filter(b => b) as THREE.Mesh[];
        const intersects = raycaster.intersectObjects(asteroidMeshes);

        if (intersects.length > 0) {
            onAsteroidClick(intersects[0].object.name);
        }
    };
    renderer.domElement.addEventListener('click', onClick);

    // Handle resize
    const onResize = () => {
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
      labelRenderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    window.addEventListener('resize', onResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', onResize);
      renderer.domElement.removeEventListener('click', onClick);
      if (mountRef.current) {
        mountRef.current.innerHTML = '';
      }
      renderer.dispose();
      scene.traverse(object => {
        if (object instanceof THREE.Mesh) {
          if (object.geometry) object.geometry.dispose();
          if (Array.isArray(object.material)) {
              object.material.forEach(material => material.dispose());
          } else if (object.material) {
              object.material.dispose();
          }
        }
      });
    };
  }, []); // Note: dependencies removed to prevent re-creation of scene on every render.
  
  // This effect handles changes in props that don't require a full scene rebuild
  useEffect(() => {
     state.clock.start();
  }, [isPlaying]);


  return <div ref={mountRef} className="absolute inset-0 w-full h-full" />;
};

export default SolarSystem;
