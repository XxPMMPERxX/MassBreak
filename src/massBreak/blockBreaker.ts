import { BlockPermutation, Dimension, ItemStack, Vector3 } from '@minecraft/server';

export interface BreakBlockResult {
  success: boolean;
  error?: string;
}

/**
 * ブロックの枠に沿って破片パーティクルを生成する
 */
function spawnBlockFrameParticles(dimension: Dimension, blockPos: Vector3): void {
  const { x, y, z } = blockPos;
  const particleType = 'minecraft:destroy_block';

  // ブロックの各エッジに沿ってパーティクルを配置
  const edgePoints: Vector3[] = [
    // 下面の4つの角
    { x: x, y: y, z: z },
    { x: x + 1, y: y, z: z },
    { x: x, y: y, z: z + 1 },
    { x: x + 1, y: y, z: z + 1 },

    // 上面の4つの角
    { x: x, y: y + 1, z: z },
    { x: x + 1, y: y + 1, z: z },
    { x: x, y: y + 1, z: z + 1 },
    { x: x + 1, y: y + 1, z: z + 1 },

    // エッジの中間点
    { x: x + 0.5, y: y, z: z },
    { x: x + 0.5, y: y, z: z + 1 },
    { x: x, y: y, z: z + 0.5 },
    { x: x + 1, y: y, z: z + 0.5 },

    { x: x + 0.5, y: y + 1, z: z },
    { x: x + 0.5, y: y + 1, z: z + 1 },
    { x: x, y: y + 1, z: z + 0.5 },
    { x: x + 1, y: y + 1, z: z + 0.5 },

    // 縦のエッジ中間点
    { x: x, y: y + 0.5, z: z },
    { x: x + 1, y: y + 0.5, z: z },
    { x: x, y: y + 0.5, z: z + 1 },
    { x: x + 1, y: y + 0.5, z: z + 1 },
  ];

  // 各ポイントにパーティクルを生成
  for (const point of edgePoints) {
    try {
      dimension.spawnParticle(particleType, point);
    } catch (error) {
      console.warn('[MassBreak] Failed to spawn particle:', error);
    }
  }
}

/**
 * 単一のブロックを破壊し、指定された位置にドロップアイテムをスポーンする
 */
export function breakBlock(
  dimension: Dimension,
  blockPos: Vector3,
  expectedBlockType: string,
  dropLocation: Vector3
): BreakBlockResult {
  try {
    const block = dimension.getBlock(blockPos);

    if (!block || block.typeId !== expectedBlockType) {
      return { success: false, error: 'Block type mismatch or not found' };
    }

    // アイテムの作成とスポーンを試行
    try {
      const itemStack = new ItemStack(expectedBlockType, 1);
      dimension.spawnItem(itemStack, dropLocation);
    } catch {
      // アイテム作成に失敗した場合、コマンドでブロックを破壊
      dimension.runCommand(`setblock ${blockPos.x} ${blockPos.y} ${blockPos.z} air destroy`);

      // ブロックの枠に沿ってパーティクルを生成
      spawnBlockFrameParticles(dimension, blockPos);

      return { success: true };
    }

    // ブロックを空気に置き換え
    block.setPermutation(BlockPermutation.resolve('minecraft:air'));

    // ブロックの枠に沿ってパーティクルを生成
    spawnBlockFrameParticles(dimension, blockPos);

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * 複数のブロックをバッチで破壊する
 */
export function breakBlockBatch(
  dimension: Dimension,
  blocks: Vector3[],
  blockType: string,
  dropLocation: Vector3
): { broken: number; failed: number } {
  let broken = 0;
  let failed = 0;

  for (const blockPos of blocks) {
    const result = breakBlock(dimension, blockPos, blockType, dropLocation);
    if (result.success) {
      broken++;
    } else {
      failed++;
      console.warn(`[MassBreak] Failed to break block at (${blockPos.x}, ${blockPos.y}, ${blockPos.z}):`, result.error);
    }
  }

  return { broken, failed };
}
