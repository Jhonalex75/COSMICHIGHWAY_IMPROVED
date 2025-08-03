import * as THREE from 'three';
import type { OrbitalElements } from './celestial-data';

const AU_SCALE = 20; // Scale down distances for better visualization

const degToRad = (degrees: number) => degrees * (Math.PI / 180);

export function getTrajectoryPoints(elements: OrbitalElements, numPoints = 1000): THREE.Vector3[] {
  const { a, e, i, omega, Omega } = elements;

  const points: THREE.Vector3[] = [];
  const isHyperbolic = e > 1;

  const iRad = degToRad(i);
  const omegaRad = degToRad(omega);
  const OmegaRad = degToRad(Omega);

  const cos_i = Math.cos(iRad);
  const sin_i = Math.sin(iRad);
  const cos_omega = Math.cos(omegaRad);
  const sin_omega = Math.sin(omegaRad);
  const cos_Omega = Math.cos(OmegaRad);
  const sin_Omega = Math.sin(OmegaRad);

  // Rotation matrix components to transform from orbital plane to 3D space
  const Px = cos_omega * cos_Omega - sin_omega * sin_Omega * cos_i;
  const Py = cos_omega * sin_Omega + sin_omega * cos_Omega * cos_i;
  const Pz = sin_omega * sin_i;
  const Qx = -sin_omega * cos_Omega - cos_omega * sin_Omega * cos_i;
  const Qy = -sin_omega * sin_Omega + cos_omega * cos_Omega * cos_i;
  const Qz = cos_omega * sin_i;

  const thetaLimit = isHyperbolic ? Math.acos(-1 / e) : Math.PI;
  const thetaStart = -thetaLimit * 0.99;
  const thetaEnd = thetaLimit * 0.99;
  
  for (let j = 0; j <= numPoints; j++) {
    const theta = thetaStart + (j / numPoints) * (thetaEnd - thetaStart);
    
    let r: number;
    if (isHyperbolic) {
        r = a * (1 - e * e) / (1 + e * Math.cos(theta));
    } else {
        r = a * (1 - e * e) / (1 + e * Math.cos(theta));
    }

    if (isHyperbolic && r < 0) continue; // Skip non-physical part of hyperbola

    // Position in the orbital plane
    const x_orb = r * Math.cos(theta);
    const y_orb = r * Math.sin(theta);

    // Transform to 3D coordinates
    const x = (Px * x_orb + Qx * y_orb) * AU_SCALE;
    const y = (Py * x_orb + Qy * y_orb) * AU_SCALE;
    const z = (Pz * x_orb + Qz * y_orb) * AU_SCALE;
    
    points.push(new THREE.Vector3(x, z, -y)); // Remap to Y-up, Z-towards-camera
  }
  return points;
}
