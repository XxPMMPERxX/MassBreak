import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Dimension, Vector3, Block, ItemStack, BlockPermutation } from '@minecraft/server';
import { breakBlock, breakBlockBatch } from '@/massBreak/blockBreaker';

describe('blockBreaker', () => {
  let consoleWarnSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    // console.warn を抑制
    consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleWarnSpy.mockRestore();
  });

  describe('breakBlock', () => {
    it('正常にブロックを破壊し、アイテムをスポーンする', () => {
      const dimension = new Dimension();
      const blockPos: Vector3 = { x: 10, y: 64, z: 20 };
      const dropLocation: Vector3 = { x: 10, y: 64.5, z: 20 };
      const block = new Block({ typeId: 'minecraft:stone', location: blockPos });

      dimension.getBlock = vi.fn(() => block);
      dimension.spawnItem = vi.fn();
      block.setPermutation = vi.fn();

      const result = breakBlock(dimension, blockPos, 'minecraft:stone', dropLocation);

      expect(result.success).toBe(true);
      expect(dimension.getBlock).toHaveBeenCalledWith(blockPos);
      expect(dimension.spawnItem).toHaveBeenCalledWith(
        expect.any(ItemStack),
        dropLocation
      );
      expect(block.setPermutation).toHaveBeenCalledWith(
        expect.objectContaining({ blockName: 'minecraft:air' })
      );
    });

    it('ブロックタイプが一致しない場合、失敗する', () => {
      const dimension = new Dimension();
      const blockPos: Vector3 = { x: 10, y: 64, z: 20 };
      const dropLocation: Vector3 = { x: 10, y: 64.5, z: 20 };
      const block = new Block({ typeId: 'minecraft:dirt', location: blockPos });

      dimension.getBlock = vi.fn(() => block);

      const result = breakBlock(dimension, blockPos, 'minecraft:stone', dropLocation);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Block type mismatch or not found');
    });

    it('ブロックが見つからない場合、失敗する', () => {
      const dimension = new Dimension();
      const blockPos: Vector3 = { x: 10, y: 64, z: 20 };
      const dropLocation: Vector3 = { x: 10, y: 64.5, z: 20 };

      dimension.getBlock = vi.fn(() => undefined);

      const result = breakBlock(dimension, blockPos, 'minecraft:stone', dropLocation);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Block type mismatch or not found');
    });

    it('アイテムスポーンが失敗した場合、コマンドでブロックを破壊する', () => {
      const dimension = new Dimension();
      const blockPos: Vector3 = { x: 10, y: 64, z: 20 };
      const dropLocation: Vector3 = { x: 10, y: 64.5, z: 20 };
      const block = new Block({ typeId: 'minecraft:stone', location: blockPos });

      dimension.getBlock = vi.fn(() => block);
      // spawnItem がエラーをスロー
      dimension.spawnItem = vi.fn(() => {
        throw new Error('Cannot spawn item');
      });
      dimension.runCommand = vi.fn();
      const setPermutationSpy = vi.spyOn(block, 'setPermutation');

      const result = breakBlock(dimension, blockPos, 'minecraft:stone', dropLocation);

      expect(result.success).toBe(true);
      expect(dimension.runCommand).toHaveBeenCalledWith(
        `setblock ${blockPos.x} ${blockPos.y} ${blockPos.z} air destroy`
      );
      // setPermutation は呼ばれない（コマンドで破壊するため）
      expect(setPermutationSpy).not.toHaveBeenCalled();
    });

    it('getBlock がエラーをスローした場合、失敗する', () => {
      const dimension = new Dimension();
      const blockPos: Vector3 = { x: 10, y: 64, z: 20 };
      const dropLocation: Vector3 = { x: 10, y: 64.5, z: 20 };

      dimension.getBlock = vi.fn(() => {
        throw new Error('Chunk not loaded');
      });

      const result = breakBlock(dimension, blockPos, 'minecraft:stone', dropLocation);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Chunk not loaded');
    });

    it('setPermutation がエラーをスローした場合、失敗する', () => {
      const dimension = new Dimension();
      const blockPos: Vector3 = { x: 10, y: 64, z: 20 };
      const dropLocation: Vector3 = { x: 10, y: 64.5, z: 20 };
      const block = new Block({ typeId: 'minecraft:stone', location: blockPos });

      dimension.getBlock = vi.fn(() => block);
      dimension.spawnItem = vi.fn();
      block.setPermutation = vi.fn(() => {
        throw new Error('Cannot set permutation');
      });

      const result = breakBlock(dimension, blockPos, 'minecraft:stone', dropLocation);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Cannot set permutation');
    });
  });

  describe('breakBlockBatch', () => {
    it('複数のブロックを破壊し、統計を返す', () => {
      const dimension = new Dimension();
      const blocks: Vector3[] = [
        { x: 10, y: 64, z: 20 },
        { x: 11, y: 64, z: 20 },
        { x: 12, y: 64, z: 20 },
      ];
      const dropLocation: Vector3 = { x: 10, y: 64.5, z: 20 };

      dimension.getBlock = vi.fn((location: Vector3) => {
        return new Block({ typeId: 'minecraft:stone', location });
      });
      dimension.spawnItem = vi.fn();

      const result = breakBlockBatch(dimension, blocks, 'minecraft:stone', dropLocation);

      expect(result.broken).toBe(3);
      expect(result.failed).toBe(0);
      expect(dimension.getBlock).toHaveBeenCalledTimes(3);
    });

    it('一部のブロックが失敗した場合、正しく統計をカウントする', () => {
      const dimension = new Dimension();
      const blocks: Vector3[] = [
        { x: 10, y: 64, z: 20 },
        { x: 11, y: 64, z: 20 }, // これが失敗
        { x: 12, y: 64, z: 20 },
      ];
      const dropLocation: Vector3 = { x: 10, y: 64.5, z: 20 };

      dimension.getBlock = vi.fn((location: Vector3) => {
        // 2番目のブロックは異なるタイプ
        if (location.x === 11) {
          return new Block({ typeId: 'minecraft:dirt', location });
        }
        return new Block({ typeId: 'minecraft:stone', location });
      });
      dimension.spawnItem = vi.fn();

      const result = breakBlockBatch(dimension, blocks, 'minecraft:stone', dropLocation);

      expect(result.broken).toBe(2);
      expect(result.failed).toBe(1);
    });

    it('すべてのブロックが失敗した場合、failed カウントのみ増える', () => {
      const dimension = new Dimension();
      const blocks: Vector3[] = [
        { x: 10, y: 64, z: 20 },
        { x: 11, y: 64, z: 20 },
      ];
      const dropLocation: Vector3 = { x: 10, y: 64.5, z: 20 };

      dimension.getBlock = vi.fn(() => undefined); // ブロックが見つからない

      const result = breakBlockBatch(dimension, blocks, 'minecraft:stone', dropLocation);

      expect(result.broken).toBe(0);
      expect(result.failed).toBe(2);
    });

    it('空の配列を処理できる', () => {
      const dimension = new Dimension();
      const blocks: Vector3[] = [];
      const dropLocation: Vector3 = { x: 10, y: 64.5, z: 20 };

      const result = breakBlockBatch(dimension, blocks, 'minecraft:stone', dropLocation);

      expect(result.broken).toBe(0);
      expect(result.failed).toBe(0);
    });

    it('単一ブロックを処理できる', () => {
      const dimension = new Dimension();
      const blocks: Vector3[] = [{ x: 10, y: 64, z: 20 }];
      const dropLocation: Vector3 = { x: 10, y: 64.5, z: 20 };

      dimension.getBlock = vi.fn((location: Vector3) => {
        return new Block({ typeId: 'minecraft:stone', location });
      });
      dimension.spawnItem = vi.fn();

      const result = breakBlockBatch(dimension, blocks, 'minecraft:stone', dropLocation);

      expect(result.broken).toBe(1);
      expect(result.failed).toBe(0);
    });

    it('エラーが発生しても処理を続行する', () => {
      const dimension = new Dimension();
      const blocks: Vector3[] = [
        { x: 10, y: 64, z: 20 },
        { x: 11, y: 64, z: 20 }, // これがエラー
        { x: 12, y: 64, z: 20 },
      ];
      const dropLocation: Vector3 = { x: 10, y: 64.5, z: 20 };

      dimension.getBlock = vi.fn((location: Vector3) => {
        if (location.x === 11) {
          throw new Error('Chunk not loaded');
        }
        return new Block({ typeId: 'minecraft:stone', location });
      });
      dimension.spawnItem = vi.fn();

      const result = breakBlockBatch(dimension, blocks, 'minecraft:stone', dropLocation);

      expect(result.broken).toBe(2);
      expect(result.failed).toBe(1);
    });
  });
});
