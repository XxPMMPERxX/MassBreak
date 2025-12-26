import { BlockPermutation, Dimension, ItemStack, Vector3 } from '@minecraft/server';

export interface BreakBlockResult {
  success: boolean;
  error?: string;
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
      return { success: true };
    }

    // ブロックを空気に置き換え
    block.setPermutation(BlockPermutation.resolve('minecraft:air'));
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
