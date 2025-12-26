/**
 * アイテムの配列を指定されたサイズのバッチに分割する
 */
export function createBatches<T>(items: T[], batchSize: number): T[][] {
  if (batchSize <= 0) {
    throw new Error('Batch size must be greater than 0');
  }

  const batches: T[][] = [];
  for (let i = 0; i < items.length; i += batchSize) {
    batches.push(items.slice(i, i + batchSize));
  }
  return batches;
}

/**
 * プレイヤーのアイテムドロップ位置をYオフセット付きで計算する
 */
export function calculateDropLocation(
  playerLocation: { x: number; y: number; z: number },
  yOffset: number = 0.5
): { x: number; y: number; z: number } {
  return {
    x: playerLocation.x,
    y: playerLocation.y + yOffset,
    z: playerLocation.z
  };
}
