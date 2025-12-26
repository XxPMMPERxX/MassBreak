import { Dimension, Vector3 } from '@minecraft/server';
import { vectorToKey, addVectors } from '@/utils/vectorUtils';

const ADJACENT_OFFSETS: Vector3[] = [
  { x: 0, y: 1, z: 0 },   // 上
  { x: 0, y: -1, z: 0 },  // 下
  { x: 1, y: 0, z: 0 },   // 東
  { x: -1, y: 0, z: 0 },  // 西
  { x: 0, y: 0, z: 1 },   // 南
  { x: 0, y: 0, z: -1 }   // 北
];

export function scanConnectedBlocks(
  startLocation: Vector3,
  targetTypeId: string,
  dimension: Dimension,
  maxBlocks: number,
  maxDistance?: number
): Vector3[] {
  const queue: Vector3[] = [];
  const visited = new Set<string>();
  const result: Vector3[] = [];

  // 開始位置を訪問済みとしてマーク（既に破壊済み）
  visited.add(vectorToKey(startLocation));

  // 隣接ブロックをキューに追加（開始点として）
  for (const offset of ADJACENT_OFFSETS) {
    const neighbor = addVectors(startLocation, offset);
    const key = vectorToKey(neighbor);
    if (!visited.has(key)) {
      visited.add(key);
      queue.push(neighbor);
    }
  }

  while (queue.length > 0 && result.length < maxBlocks) {
    const current = queue.shift()!;

    try {
      const currentBlock = dimension.getBlock(current);

      if (!currentBlock || currentBlock.typeId !== targetTypeId) {
        continue;
      }

      result.push(current);

      // 隣接ブロックをチェック
      for (const offset of ADJACENT_OFFSETS) {
        const neighbor = addVectors(current, offset);

        // 距離チェック
        if (maxDistance !== undefined) {
          const dx = Math.abs(neighbor.x - startLocation.x);
          const dy = Math.abs(neighbor.y - startLocation.y);
          const dz = Math.abs(neighbor.z - startLocation.z);

          if (dx > maxDistance || dy > maxDistance || dz > maxDistance) {
            continue;
          }
        }

        const key = vectorToKey(neighbor);
        if (!visited.has(key)) {
          visited.add(key);
          queue.push(neighbor);
        }
      }
    } catch (error) {
      // 読み込まれていないチャンクまたは範囲外のブロックをスキップ
      console.warn(`[MassBreak] Skipping block at ${vectorToKey(current)}:`, error);
      continue;
    }
  }

  return result;
}
