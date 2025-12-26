import { describe, it, expect } from 'vitest';
import { createBatches, calculateDropLocation } from '@/massBreak/batchProcessor';

describe('batchProcessor', () => {
  describe('createBatches', () => {
    it('指定されたサイズでバッチを作成できる', () => {
      const items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      const batches = createBatches(items, 3);

      expect(batches).toHaveLength(4);
      expect(batches[0]).toEqual([1, 2, 3]);
      expect(batches[1]).toEqual([4, 5, 6]);
      expect(batches[2]).toEqual([7, 8, 9]);
      expect(batches[3]).toEqual([10]);
    });

    it('空の配列を処理できる', () => {
      const batches = createBatches([], 5);
      expect(batches).toHaveLength(0);
    });

    it('単一アイテムを処理できる', () => {
      const batches = createBatches([1], 5);
      expect(batches).toHaveLength(1);
      expect(batches[0]).toEqual([1]);
    });

    it('アイテム数がバッチサイズより少ない場合、単一バッチを作成する', () => {
      const items = [1, 2, 3];
      const batches = createBatches(items, 10);

      expect(batches).toHaveLength(1);
      expect(batches[0]).toEqual([1, 2, 3]);
    });

    it('アイテム数がバッチサイズで割り切れる場合、均等なバッチを作成する', () => {
      const items = [1, 2, 3, 4, 5, 6];
      const batches = createBatches(items, 2);

      expect(batches).toHaveLength(3);
      expect(batches[0]).toEqual([1, 2]);
      expect(batches[1]).toEqual([3, 4]);
      expect(batches[2]).toEqual([5, 6]);
    });

    it('バッチサイズが0以下の場合、エラーをスローする', () => {
      expect(() => createBatches([1, 2, 3], 0)).toThrow('Batch size must be greater than 0');
      expect(() => createBatches([1, 2, 3], -1)).toThrow('Batch size must be greater than 0');
    });

    it('異なるデータ型でも動作する', () => {
      const items = ['a', 'b', 'c', 'd'];
      const batches = createBatches(items, 2);

      expect(batches).toHaveLength(2);
      expect(batches[0]).toEqual(['a', 'b']);
      expect(batches[1]).toEqual(['c', 'd']);
    });
  });

  describe('calculateDropLocation', () => {
    it('デフォルトのYオフセット0.5を追加する', () => {
      const playerLoc = { x: 10, y: 64, z: 20 };
      const dropLoc = calculateDropLocation(playerLoc);

      expect(dropLoc).toEqual({
        x: 10,
        y: 64.5,
        z: 20
      });
    });

    it('カスタムYオフセットを追加する', () => {
      const playerLoc = { x: 10, y: 64, z: 20 };
      const dropLoc = calculateDropLocation(playerLoc, 1.0);

      expect(dropLoc).toEqual({
        x: 10,
        y: 65,
        z: 20
      });
    });
  });
});
