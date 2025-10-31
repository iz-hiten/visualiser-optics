import { OpticalComponentData, Position, RaySegment, ComponentType } from '../types';
import { add, subtract, scale } from '../utils/vector';

const MAX_BOUNCES = 30;

// --- Vector Math Helpers ---
const toRadians = (degrees: number): number => degrees * (Math.PI / 180);
const normalize = (v: Position): Position => {
    const mag = Math.sqrt(v.x * v.x + v.y * v.y);
    return mag === 0 ? { x: 0, y: 0 } : { x: v.x / mag, y: v.y / mag };
};
const dot = (v1: Position, v2: Position) => v1.x * v2.x + v1.y * v2.y;
const perpendicular = (v: Position): Position => ({ x: -v.y, y: v.x });

interface ActiveRay {
  origin: Position;
  dir: Position; // direction vector
  intensity: number;
  lastHitId?: string;
}

interface Intersection {
    dist: number;
    point: Position;
    component: OpticalComponentData;
    normal: Position;
}

function findClosestIntersection(ray: ActiveRay, components: OpticalComponentData[]): Intersection | null {
    let closestIntersection: Intersection | null = null;

    for (const component of components) {
        if (component.id === ray.lastHitId || component.type === ComponentType.LASER) {
            continue;
        }

        const angleRad = toRadians(component.rotation);
        const cosA = Math.cos(angleRad);
        const sinA = Math.sin(angleRad);

        // Vector from ray origin to component center
        const oc = subtract(component.position, ray.origin);
        
        let baseNormal: Position;
        switch (component.type) {
            case ComponentType.MIRROR:
            case ComponentType.CONVEX_LENS:
            case ComponentType.CONCAVE_LENS:
            case ComponentType.DETECTOR:
                baseNormal = { x: 1, y: 0 };
                break;
            case ComponentType.BEAM_SPLITTER:
                baseNormal = { x: Math.cos(toRadians(-45)), y: Math.sin(toRadians(-45)) };
                break;
            default: continue;
        }

        const normal = {
            x: baseNormal.x * cosA - baseNormal.y * sinA,
            y: baseNormal.x * sinA + baseNormal.y * cosA,
        };
        const tangent = perpendicular(normal);

        const denominator = dot(ray.dir, normal);
        if (Math.abs(denominator) < 1e-6) continue;

        const t = dot(oc, normal) / denominator;
        if (t < 1e-4) continue;

        const point = add(ray.origin, scale(ray.dir, t));
        const vecToCenter = subtract(point, component.position);
        
        const projectedLength = Math.abs(dot(vecToCenter, tangent));
        // FIX: Physical size now directly matches visual size property
        const componentHalfLength = (component.size ?? 1) * 2.5 * 0.5;

        if (projectedLength > componentHalfLength) continue;

        if (!closestIntersection || t < closestIntersection.dist) {
            closestIntersection = { dist: t, point, component, normal };
        }
    }
    return closestIntersection;
}

export const calculateRayPath = (components: OpticalComponentData[]): RaySegment[] => {
  const lasers = components.filter(c => c.type === ComponentType.LASER);
  if (lasers.length === 0) return [];

  const finalPathSegments: RaySegment[] = [];
  
  let activeRays: ActiveRay[] = [];

  for (const laser of lasers) {
    const laserAngleRad = toRadians(laser.rotation);
    const initialDir = { x: Math.cos(laserAngleRad), y: Math.sin(laserAngleRad) };
    const initialOrigin = add(laser.position, scale(initialDir, 1e-3));
    activeRays.push({
      origin: initialOrigin,
      dir: initialDir,
      intensity: 1.0,
      lastHitId: laser.id,
    });
  }
  
  for (let bounce = 0; bounce < MAX_BOUNCES && activeRays.length > 0; bounce++) {
    const nextActiveRays: ActiveRay[] = [];

    for (const ray of activeRays) {
      const intersection = findClosestIntersection(ray, components);

      if (intersection) {
        finalPathSegments.push({ p1: ray.origin, p2: intersection.point, intensity: ray.intensity });
        
        const { component, normal, point } = intersection;

        if (component.type === ComponentType.DETECTOR) continue;

        let surfaceNormal = normal;
        if (dot(ray.dir, surfaceNormal) > 0) {
            surfaceNormal = scale(surfaceNormal, -1);
        }

        if (component.type === ComponentType.MIRROR || component.type === ComponentType.BEAM_SPLITTER) {
            const d = dot(ray.dir, surfaceNormal);
            const reflectedDir = normalize(subtract(ray.dir, scale(surfaceNormal, 2 * d)));
            
            nextActiveRays.push({
                origin: point,
                dir: reflectedDir,
                intensity: ray.intensity * (component.reflectivity ?? 1),
                lastHitId: component.id,
            });
        }
        
        if (component.type === ComponentType.BEAM_SPLITTER) {
            nextActiveRays.push({
                origin: point,
                dir: ray.dir,
                intensity: ray.intensity * (component.transmissivity ?? 0.5),
                lastHitId: component.id,
            });
        }
        
        if (component.type === ComponentType.CONVEX_LENS || component.type === ComponentType.CONCAVE_LENS) {
            const focalLength = component.focalLength ?? 1;
            const f = component.type === ComponentType.CONVEX_LENS ? focalLength : -focalLength;
            const principalAxis = perpendicular(surfaceNormal);
            const distFromCenter = dot(subtract(point, component.position), principalAxis);

            const refractedDir = normalize(add(ray.dir, scale(principalAxis, -distFromCenter / f)));
            
            nextActiveRays.push({
                origin: point,
                dir: refractedDir,
                intensity: ray.intensity,
                lastHitId: component.id,
             });
        }

      } else {
        const endPos = add(ray.origin, scale(ray.dir, 500));
        finalPathSegments.push({ p1: ray.origin, p2: endPos, intensity: ray.intensity });
      }
    }
    activeRays = nextActiveRays.filter(r => r.intensity > 0.01);
  }

  return finalPathSegments;
};