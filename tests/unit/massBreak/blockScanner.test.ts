import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Dimension, Vector3, Block } from '@minecraft/server';
import { scanConnectedBlocks } from '@/massBreak/blockScanner';

describe('blockScanner', () => {
  let consoleWarnSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    // console.warn を抑制
    consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleWarnSpy.mockRestore();
  });

  describe('scanConnectedBlocks', () => {
    it('隣接する同じタイプのブロックをスキャンできる', () => {
      const dimension = new Dimension();
      const startLocation: Vector3 = { x: 0, y: 64, z: 0 };

      // モックの設定: 隣接する3つのブロックが同じタイプ
      const getBlockMock = vi.fn((location: Vector3) => {
        const key = `${location.x},${location.y},${location.z}`;
        const blockMap: Record<string, Block | undefined> = {
          '0,65,0': new Block({ typeId: 'minecraft:stone', location: { x: 0, y: 65, z: 0 } }), // 上
          '1,64,0': new Block({ typeId: 'minecraft:stone', location: { x: 1, y: 64, z: 0 } }), // 東
          '0,64,1': new Block({ typeId: 'minecraft:stone', location: { x: 0, y: 64, z: 1 } }), // 南
        };
        return blockMap[key];
      });

      dimension.getBlock = getBlockMock;

      const result = scanConnectedBlocks(
        startLocation,
        'minecraft:stone',
        dimension,
        64
      );

      expect(result).toHaveLength(3);
      expect(result).toContainEqual({ x: 0, y: 65, z: 0 });
      expect(result).toContainEqual({ x: 1, y: 64, z: 0 });
      expect(result).toContainEqual({ x: 0, y: 64, z: 1 });
    });

    it('maxBlocks 上限で結果を制限する', () => {
      const dimension = new Dimension();
      const startLocation: Vector3 = { x: 0, y: 64, z: 0 };

      // 5つの接続ブロックを用意
      const getBlockMock = vi.fn((location: Vector3) => {
        const key = `${location.x},${location.y},${location.z}`;
        const blockMap: Record<string, Block | undefined> = {
          '0,65,0': new Block({ typeId: 'minecraft:stone' }),
          '0,63,0': new Block({ typeId: 'minecraft:stone' }),
          '1,64,0': new Block({ typeId: 'minecraft:stone' }),
          '-1,64,0': new Block({ typeId: 'minecraft:stone' }),
          '0,64,1': new Block({ typeId: 'minecraft:stone' }),
        };
        return blockMap[key];
      });

      dimension.getBlock = getBlockMock;

      const result = scanConnectedBlocks(
        startLocation,
        'minecraft:stone',
        dimension,
        3 // maxBlocks を 3 に制限
      );

      // 最大3つまでしか返されない
      expect(result).toHaveLength(3);
    });

    it('maxDistance で範囲を制限する', () => {
      const dimension = new Dimension();
      const startLocation: Vector3 = { x: 0, y: 64, z: 0 };

      // 距離2と距離3の位置にブロックを配置
      const getBlockMock = vi.fn((location: Vector3) => {
        return new Block({ typeId: 'minecraft:stone', location });
      });

      dimension.getBlock = getBlockMock;

      const result = scanConnectedBlocks(
        startLocation,
        'minecraft:stone',
        dimension,
        100,
        2 // maxDistance を 2 に制限
      );

      // 距離2以内のブロックのみが含まれる
      for (const block of result) {
        const dx = Math.abs(block.x - startLocation.x);
        const dy = Math.abs(block.y - startLocation.y);
        const dz = Math.abs(block.z - startLocation.z);

        expect(dx).toBeLessThanOrEqual(2);
        expect(dy).toBeLessThanOrEqual(2);
        expect(dz).toBeLessThanOrEqual(2);
      }
    });

    it('異なるブロックタイプは無視される', () => {
      const dimension = new Dimension();
      const startLocation: Vector3 = { x: 0, y: 64, z: 0 };

      const getBlockMock = vi.fn((location: Vector3) => {
        const key = `${location.x},${location.y},${location.z}`;
        const blockMap: Record<string, Block | undefined> = {
          '0,65,0': new Block({ typeId: 'minecraft:stone' }),
          '0,63,0': new Block({ typeId: 'minecraft:dirt' }), // 異なるタイプ
          '1,64,0': new Block({ typeId: 'minecraft:stone' }),
          '-1,64,0': new Block({ typeId: 'minecraft:grass' }), // 異なるタイプ
        };
        return blockMap[key];
      });

      dimension.getBlock = getBlockMock;

      const result = scanConnectedBlocks(
        startLocation,
        'minecraft:stone',
        dimension,
        64
      );

      // stone のみが含まれる
      expect(result).toHaveLength(2);
      expect(result).toContainEqual({ x: 0, y: 65, z: 0 });
      expect(result).toContainEqual({ x: 1, y: 64, z: 0 });
    });

    it('接続ブロックがない場合、空配列を返す', () => {
      const dimension = new Dimension();
      const startLocation: Vector3 = { x: 0, y: 64, z: 0 };

      // すべての隣接ブロックが異なるタイプまたは存在しない
      const getBlockMock = vi.fn(() => {
        return new Block({ typeId: 'minecraft:dirt' });
      });

      dimension.getBlock = getBlockMock;

      const result = scanConnectedBlocks(
        startLocation,
        'minecraft:stone',
        dimension,
        64
      );

      expect(result).toHaveLength(0);
    });

    it('getBlock がエラーをスローしても続行する', () => {
      const dimension = new Dimension();
      const startLocation: Vector3 = { x: 0, y: 64, z: 0 };

      const getBlockMock = vi.fn((location: Vector3) => {
        const key = `${location.x},${location.y},${location.z}`;
        // 上方向はエラー、東方向は成功
        if (key === '0,65,0') {
          throw new Error('Chunk not loaded');
        }
        if (key === '1,64,0') {
          return new Block({ typeId: 'minecraft:stone', location: { x: 1, y: 64, z: 0 } });
        }
        return undefined;
      });

      dimension.getBlock = getBlockMock;

      // エラーが発生してもクラッシュせず、他のブロックを返す
      const result = scanConnectedBlocks(
        startLocation,
        'minecraft:stone',
        dimension,
        64
      );

      expect(result).toHaveLength(1);
      expect(result).toContainEqual({ x: 1, y: 64, z: 0 });
    });

    it('連鎖的に接続されたブロックを全てスキャンする', () => {
      const dimension = new Dimension();
      const startLocation: Vector3 = { x: 0, y: 64, z: 0 };

      // 0,65,0 -> 0,66,0 -> 0,67,0 のように連鎖
      const getBlockMock = vi.fn((location: Vector3) => {
        const y = location.y;
        if (location.x === 0 && location.z === 0 && y >= 65 && y <= 67) {
          return new Block({ typeId: 'minecraft:stone', location });
        }
        return undefined;
      });

      dimension.getBlock = getBlockMock;

      const result = scanConnectedBlocks(
        startLocation,
        'minecraft:stone',
        dimension,
        64
      );

      expect(result).toHaveLength(3);
      expect(result).toContainEqual({ x: 0, y: 65, z: 0 });
      expect(result).toContainEqual({ x: 0, y: 66, z: 0 });
      expect(result).toContainEqual({ x: 0, y: 67, z: 0 });
    });

    it('開始位置は結果に含まれない（既に破壊済み）', () => {
      const dimension = new Dimension();
      const startLocation: Vector3 = { x: 0, y: 64, z: 0 };

      const getBlockMock = vi.fn((location: Vector3) => {
        return new Block({ typeId: 'minecraft:stone', location });
      });

      dimension.getBlock = getBlockMock;

      const result = scanConnectedBlocks(
        startLocation,
        'minecraft:stone',
        dimension,
        64
      );

      // 開始位置 (0,64,0) は含まれない
      expect(result).not.toContainEqual({ x: 0, y: 64, z: 0 });
    });
  });
});
