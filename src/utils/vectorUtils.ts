import { Vector3 } from '@minecraft/server';

export function vectorToKey(v: Vector3): string {
  return `${v.x},${v.y},${v.z}`;
}

export function addVectors(a: Vector3, b: Vector3): Vector3 {
  return { x: a.x + b.x, y: a.y + b.y, z: a.z + b.z };
}
