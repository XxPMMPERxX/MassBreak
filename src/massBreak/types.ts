import { Vector3 } from '@minecraft/server';

export interface ScanOptions {
  maxBlocks: number;
  maxDistance?: number;
}

export interface MassBreakResult {
  blocksFound: Vector3[];
  blocksBroken: number;
}
