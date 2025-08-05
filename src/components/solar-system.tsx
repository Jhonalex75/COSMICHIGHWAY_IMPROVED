"use client";

import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js';
import { getTrajectoryPoints } from '@/lib/orbital-mechanics';
import type { CelestialBody, Planet, Asteroid } from '@/lib/celestial-data';

interface SolarSystemProps {
  sun: CelestialBody;
  planets: Planet[];
  asteroids: Asteroid[];
  playingState: Record<string, boolean>;
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
  timeOffset: number;
  trajectoryLine: THREE.Line;
}

const SolarSystem: React.FC<SolarSystemProps> = ({ sun, planets, asteroids, playingState, animationSpeed, onAsteroidClick, onMetricsUpdate }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const state = useRef<{
    celestialObjects: Map<string, CelestialObject>;
    lastUpdateTime: number;
    clock: THREE.Clock;
    hoverLabel: CSS2DObject | null;
    scene: THREE.Scene | null;
  }>({
    celestialObjects: new Map(),
    lastUpdateTime: 0,
    clock: new THREE.Clock(),
    hoverLabel: null,
    scene: null,
  }).current;

  useEffect(() => {
    if (!mountRef.current) return;
    const mount = mountRef.current;
    
    // Scene setup
    const scene = new THREE.Scene();
    state.scene = scene;
    const camera = new THREE.PerspectiveCamera(75, mount.clientWidth / mount.clientHeight, 0.1, 2000);
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
        const x = THREE.MathUtils.randFloatSpread(4000);
        const y = THREE.MathUtils.randFloatSpread(4000);
        const z = THREE.MathUtils.randFloatSpread(4000);
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
      
      const path = new THREE.CatmullRomCurve3(trajectoryPoints, false);
      const geometry = new THREE.BufferGeometry().setFromPoints(path.getPoints(500));
      const material = new THREE.LineBasicMaterial({ color: bodyData.color, transparent: true, opacity: 0.5 });
      const trajectoryLine = new THREE.Line(geometry, material);
      trajectoryLine.name = `trajectory-${bodyData.name}`;
      trajectoryLine.userData = { bodyName: bodyData.name };
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
        timeOffset: Math.random(),
        trajectoryLine,
      });
    });

    const hoverLabelDiv = document.createElement('div');
    hoverLabelDiv.className = 'text-white text-xs p-2 rounded-lg bg-black/70 backdrop-blur-sm whitespace-nowrap border border-white/20';
    hoverLabelDiv.style.display = 'none';
    const hoverLabel = new CSS2DObject(hoverLabelDiv);
    state.hoverLabel = hoverLabel;
    scene.add(hoverLabel);
    
    // Animation loop
    state.lastUpdateTime = state.clock.getElapsedTime();
    state.clock.start();

    const animate = () => {
      requestAnimationFrame(animate);

      const elapsedTime = state.clock.getElapsedTime();
      const deltaTime = elapsedTime - state.lastUpdateTime;
      state.lastUpdateTime = elapsedTime;

      if (deltaTime > 0) {
        state.celestialObjects.forEach((obj, name) => {
          const isAsteroid = asteroids.some(a => a.name === name);
          const isPlaying = isAsteroid ? playingState[name] : true;

          if (isPlaying) {
            const visualSpeedMultiplier = (obj.data as Asteroid).visualSpeedMultiplier ?? 1.0;
            obj.timeOffset += deltaTime * animationSpeed * visualSpeedMultiplier;
          }

          const time = obj.timeOffset % 1;
          const position = obj.path.getPointAt(time);
          obj.body.position.copy(position);
  
          if (isAsteroid) {
              const distanceToSun = position.length();
              
              if(isPlaying) {
                const newVelocity = position.clone().sub(obj.prevPosition).divideScalar(deltaTime);
                if(isFinite(newVelocity.x) && isFinite(newVelocity.y) && isFinite(newVelocity.z)) {
                  const newAcceleration = newVelocity.clone().sub(obj.velocity).divideScalar(deltaTime);
    
                  obj.velocity.copy(newVelocity);
                  if(isFinite(newAcceleration.x) && isFinite(newAcceleration.y) && isFinite(newAcceleration.z)) {
                    obj.acceleration.copy(newAcceleration);
                  }
                }
                obj.prevPosition.copy(position);
              }
  
              const velocityMagnitude = obj.velocity.length();
              const accelerationMagnitude = obj.acceleration.length();
  
              const labelDiv = obj.label.element as HTMLDivElement;
              const status = isPlaying ? '►' : '❚❚';
              labelDiv.innerHTML = `${name} ${status}`;

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
    
    const raycaster = new THREE.Raycaster();
    // Increase threshold for line intersection
    raycaster.params.Line.threshold = 0.5;
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

    const onMouseMove = (event: MouseEvent) => {
      if (!state.hoverLabel) return;

      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);

      const trajectoryLines = asteroids.map(a => state.celestialObjects.get(a.name)?.trajectoryLine).filter(l => l) as THREE.Line[];
      const intersects = raycaster.intersectObjects(trajectoryLines);

      if (intersects.length > 0) {
        const intersection = intersects[0];
        const point = intersection.point;
        const bodyName = (intersection.object as any).userData.bodyName;
        
        const distToSun = point.length();

        state.hoverLabel.element.style.display = 'block';
        state.hoverLabel.position.copy(point);
        state.hoverLabel.element.innerHTML = `
          <strong class="text-primary">${bodyName}</strong><br>
          Dist. Sol: ${distToSun.toFixed(2)} AU<br>
          X: ${point.x.toFixed(2)} AU<br>
          Y: ${point.y.toFixed(2)} AU<br>
          Z: ${point.z.toFixed(2)} AU
        `;
      } else {
        state.hoverLabel.element.style.display = 'none';
      }
    };
    
    renderer.domElement.addEventListener('click', onClick);
    renderer.domElement.addEventListener('mousemove', onMouseMove);

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
      renderer.domElement.removeEventListener('mousemove', onMouseMove);
      if (mountRef.current) {
        mountRef.current.innerHTML = '';
      }
      renderer.dispose();
      state.scene?.traverse(object => {
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
  }, []);
  
  return <div ref={mountRef} className="absolute inset-0 w-full h-full" />;
};

export default SolarSystem;
