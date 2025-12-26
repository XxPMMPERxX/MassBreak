import { EventManager, debug, delayed } from 'keystonemc';
import { scanConnectedBlocks } from './blockScanner';
import { MASS_BREAK_CONFIG } from './config';
import { shouldProcessMassBreak } from './validators';
import { createBatches, calculateDropLocation } from './batchProcessor';
import { breakBlockBatch } from './blockBreaker';

EventManager.registerAfter('playerBreakBlock', {
  handler(event) {
    try {
      debug(event.player.isSneaking, event.player.getGameMode());
      // 検証: ゲームモードとスニーク要件をチェック
      if (!shouldProcessMassBreak(
        event.player.getGameMode(),
        event.player.isSneaking,
        MASS_BREAK_CONFIG.REQUIRE_SNEAK
      )) {
        return;
      }

      // 破壊されたブロックの情報を取得
      const brokenBlockType = event.brokenBlockPermutation.type.id;
      const breakLocation = event.block.location;
      const dimension = event.block.dimension;

      // 接続されたブロックをスキャン
      const blocksToBreak = scanConnectedBlocks(
        breakLocation,
        brokenBlockType,
        dimension,
        MASS_BREAK_CONFIG.MAX_BLOCKS
      );

      // 接続されたブロックが見つからなければ何もしない
      if (blocksToBreak.length === 0) {
        return;
      }

      // アイテムドロップのためのプレイヤー位置を計算
      const dropLocation = calculateDropLocation(event.player.location);

      // パフォーマンスのためブロックをバッチで破壊
      const batches = createBatches(blocksToBreak, MASS_BREAK_CONFIG.BATCH_SIZE);

      // 遅延を挟んで各バッチを処理
      batches.forEach((batch, index) => {
        delayed(index * MASS_BREAK_CONFIG.BATCH_DELAY_TICKS, () => {
          breakBlockBatch(dimension, batch, brokenBlockType, dropLocation);
        });
      });

    } catch (error) {
      console.error('[MassBreak] Unexpected error in mass break handler:', error);
    }
  }
});
