import { GameMode } from '@minecraft/server';

/**
 * ゲームモードとスニーク要件に基づいて、一括破壊を実行すべきかを検証する
 */
export function shouldProcessMassBreak(
  gameMode: GameMode,
  isSneaking: boolean,
  requireSneak: boolean
): boolean {
  // サバイバルモードでのみ許可
  if (gameMode !== GameMode.Survival) {
    return false;
  }

  // スニーク要件が有効な場合はチェック
  if (requireSneak && !isSneaking) {
    return false;
  }

  return true;
}
