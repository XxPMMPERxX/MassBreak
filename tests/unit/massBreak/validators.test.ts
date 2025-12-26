import { describe, it, expect } from 'vitest';
import { GameMode } from '@minecraft/server';
import { shouldProcessMassBreak } from '@/massBreak/validators';

describe('validators', () => {
  describe('shouldProcessMassBreak', () => {
    it('サバイバルモードでスニーク不要の場合、trueを返す', () => {
      const result = shouldProcessMassBreak(GameMode.Survival, false, false);
      expect(result).toBe(true);
    });

    it('サバイバルモードでスニークしている場合（スニーク必須）、trueを返す', () => {
      const result = shouldProcessMassBreak(GameMode.Survival, true, true);
      expect(result).toBe(true);
    });

    it('サバイバルモード以外の場合、falseを返す', () => {
      const result = shouldProcessMassBreak(GameMode.Creative, true, false);
      expect(result).toBe(false);
    });

    it('スニーク必須だがスニークしていない場合、falseを返す', () => {
      const result = shouldProcessMassBreak(GameMode.Survival, false, true);
      expect(result).toBe(false);
    });

    it('アドベンチャーモードの場合、falseを返す', () => {
      const result = shouldProcessMassBreak(GameMode.Adventure, true, false);
      expect(result).toBe(false);
    });

    it('スペクテイターモードの場合、falseを返す', () => {
      const result = shouldProcessMassBreak(GameMode.Spectator, true, false);
      expect(result).toBe(false);
    });
  });
});
