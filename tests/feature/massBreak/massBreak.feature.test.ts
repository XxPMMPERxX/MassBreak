import { describe, it, expect, vi, beforeEach, afterEach, beforeAll } from 'vitest';
import { GameMode, Player, BlockPermutation, Block, Dimension } from '@minecraft/server';
import type { BlockBreakAfterEvent } from '@minecraft/server';

// モジュールをモック
vi.mock('keystonemc', () => {
  const handlers = new Map<string, Array<{ handler: (event: any) => void }>>();

  return {
    EventManager: {
      registerAfter: vi.fn((eventName: string, eventHandler: { handler: (event: any) => void }) => {
        if (!handlers.has(eventName)) {
          handlers.set(eventName, []);
        }
        handlers.get(eventName)!.push(eventHandler);
      }),
      getHandlers: (eventName: string) => handlers.get(eventName) ?? [],
      clearHandlers: () => handlers.clear(),
    },
    delayed: vi.fn((ticks: number, callback: () => void) => {
      // テストでは即座に実行
      callback();
    }),
    debug: vi.fn(),
  };
});

vi.mock('@/massBreak/blockScanner', () => ({
  scanConnectedBlocks: vi.fn(),
}));

vi.mock('@/massBreak/blockBreaker', () => ({
  breakBlockBatch: vi.fn(() => ({ broken: 0, failed: 0 })),
}));

// モックをインポート
import { EventManager, delayed } from 'keystonemc';
import { scanConnectedBlocks } from '@/massBreak/blockScanner';
import { breakBlockBatch } from '@/massBreak/blockBreaker';

describe('MassBreak Feature Tests', () => {
  beforeAll(async () => {
    // テスト対象のモジュールをインポート（イベントハンドラーが登録される）
    await import('@/massBreak/index');
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('正常系: ブロック破壊フロー', () => {
    it('サバイバルモードでスニーク時、接続ブロックを一括破壊する', async () => {

      // モックの設定
      const mockPlayer = new Player({
        location: { x: 10, y: 64, z: 20 },
        isSneaking: true,
        gameMode: GameMode.Survival,
      });

      const mockDimension = new Dimension();
      const mockBlock = new Block();
      const mockPermutation = BlockPermutation.resolve('minecraft:stone');

      // BlockBreakAfterEventを作成
      const event: BlockBreakAfterEvent = {
        player: mockPlayer,
        block: mockBlock,
        brokenBlockPermutation: mockPermutation,
      };

      // scanConnectedBlocksが接続ブロックを返すようにモック
      const connectedBlocks = [
        { x: 10, y: 64, z: 21 },
        { x: 10, y: 64, z: 22 },
        { x: 10, y: 65, z: 21 },
      ];
      vi.mocked(scanConnectedBlocks).mockReturnValue(connectedBlocks);

      // イベントハンドラーを取得して実行
      const handlers = (EventManager as any).getHandlers('playerBreakBlock');
      expect(handlers).toHaveLength(1);

      await handlers[0].handler(event);

      // scanConnectedBlocksが呼ばれたことを確認
      expect(scanConnectedBlocks).toHaveBeenCalledWith(
        mockBlock.location,
        'minecraft:stone',
        mockDimension,
        64 // MASS_BREAK_CONFIG.MAX_BLOCKS
      );

      // breakBlockBatchが呼ばれたことを確認
      expect(breakBlockBatch).toHaveBeenCalled();

      // delayedが呼ばれたことを確認
      expect(delayed).toHaveBeenCalled();
    });

    it('複数バッチに分割して破壊する', async () => {

      const mockPlayer = new Player({
        location: { x: 0, y: 64, z: 0 },
        isSneaking: true,
        gameMode: GameMode.Survival,
      });

      const mockDimension = new Dimension();
      const mockBlock = new Block();
      const mockPermutation = BlockPermutation.resolve('minecraft:stone');

      const event: BlockBreakAfterEvent = {
        player: mockPlayer,
        block: mockBlock,
        brokenBlockPermutation: mockPermutation,
      };

      // 20個の接続ブロックを返す（BATCH_SIZE=16なので2バッチに分割される）
      const connectedBlocks = Array.from({ length: 20 }, (_, i) => ({
        x: i,
        y: 64,
        z: 0,
      }));
      vi.mocked(scanConnectedBlocks).mockReturnValue(connectedBlocks);

      const handlers = (EventManager as any).getHandlers('playerBreakBlock');
      await handlers[0].handler(event);

      // breakBlockBatchが2回呼ばれることを確認（16個 + 4個）
      expect(breakBlockBatch).toHaveBeenCalledTimes(2);

      // delayedが2回呼ばれることを確認
      expect(delayed).toHaveBeenCalledTimes(2);
    });
  });

  describe('条件分岐: 処理がスキップされるケース', () => {
    it('クリエイティブモードでは何もしない', async () => {

      const mockPlayer = new Player({
        location: { x: 0, y: 64, z: 0 },
        isSneaking: true,
        gameMode: GameMode.Creative, // クリエイティブモード
      });

      const mockDimension = new Dimension();
      const mockBlock = new Block();
      const mockPermutation = BlockPermutation.resolve('minecraft:stone');

      const event: BlockBreakAfterEvent = {
        player: mockPlayer,
        block: mockBlock,
        brokenBlockPermutation: mockPermutation,
      };

      const handlers = (EventManager as any).getHandlers('playerBreakBlock');
      await handlers[0].handler(event);

      // scanConnectedBlocksが呼ばれないことを確認
      expect(scanConnectedBlocks).not.toHaveBeenCalled();
      expect(breakBlockBatch).not.toHaveBeenCalled();
    });

    it('スニーク要件が有効でスニークしていない場合は何もしない', async () => {

      const mockPlayer = new Player({
        location: { x: 0, y: 64, z: 0 },
        isSneaking: false, // スニークしていない
        gameMode: GameMode.Survival,
      });

      const mockDimension = new Dimension();
      const mockBlock = new Block();
      const mockPermutation = BlockPermutation.resolve('minecraft:stone');

      const event: BlockBreakAfterEvent = {
        player: mockPlayer,
        block: mockBlock,
        brokenBlockPermutation: mockPermutation,
      };

      const handlers = (EventManager as any).getHandlers('playerBreakBlock');
      await handlers[0].handler(event);

      // scanConnectedBlocksが呼ばれないことを確認
      expect(scanConnectedBlocks).not.toHaveBeenCalled();
      expect(breakBlockBatch).not.toHaveBeenCalled();
    });

    it('接続ブロックが見つからない場合は何もしない', async () => {

      const mockPlayer = new Player({
        location: { x: 0, y: 64, z: 0 },
        isSneaking: true,
        gameMode: GameMode.Survival,
      });

      const mockDimension = new Dimension();
      const mockBlock = new Block();
      const mockPermutation = BlockPermutation.resolve('minecraft:stone');

      const event: BlockBreakAfterEvent = {
        player: mockPlayer,
        block: mockBlock,
        brokenBlockPermutation: mockPermutation,
      };

      // 接続ブロックが空配列を返す
      vi.mocked(scanConnectedBlocks).mockReturnValue([]);

      const handlers = (EventManager as any).getHandlers('playerBreakBlock');
      await handlers[0].handler(event);

      // scanConnectedBlocksは呼ばれる
      expect(scanConnectedBlocks).toHaveBeenCalled();
      // しかしbreakBlockBatchは呼ばれない
      expect(breakBlockBatch).not.toHaveBeenCalled();
    });
  });
});
