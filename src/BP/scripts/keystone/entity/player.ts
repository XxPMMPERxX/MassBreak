import { Player, PlayerLeaveAfterEvent, PlayerSpawnAfterEvent, world } from '@minecraft/server';
import { _Vector3 } from '../math/vector3';
import { delegate } from '../utils/delegate';

export type KeystonePlayer = _Player & Player;

export class PlayerRegistry {
  /**
   * プレイヤーオブジェクトから取得
   * @param {Player} player
   * @returns {KeystonePlayer}
   */
  static fromPlayer(player: Player): KeystonePlayer {
    if (!_Player._players.has(player.id)) {
      throw new Error(`${player.id}のプレイヤーがレジストリに登録されていません`);
    };
    return _Player._players.get(player.id) as KeystonePlayer;
  }

  /**
   * IDから取得
   * @param {string} playerId
   * @returns {KeystonePlayer}
   */
  static fromId(playerId: string): KeystonePlayer {
    if (!_Player._players.has(playerId)) {
      throw new Error(`${playerId}のプレイヤーがレジストリに登録されていません`);
    };
    return _Player._players.get(playerId) as KeystonePlayer;
  }
}

/**
 * 拡張機能を備えたPlayerオブジェクト
 */
class _Player {
  static _players: Map<string, KeystonePlayer> = new Map();

  /**
   * 生成
   * @param {Player} player
   */
  static hello(player: Player): void {
    _Player._players.set(player.id, delegate(new _Player(player), player));
  }

  /**
   * 削除
   * @param {string} playerId
   */
  static bye(playerId: string): void {
    _Player._players.delete(playerId);
  }

  public origin: Player;
  public lastLocation: _Vector3;

  private constructor(player: Player) {
    this.origin = player;
    this.lastLocation = _Vector3.fromBDS(player.location);
  }
}

world.afterEvents.playerSpawn.subscribe((event: PlayerSpawnAfterEvent) => {
  if (event.initialSpawn) _Player.hello(event.player);
});

world.afterEvents.playerLeave.subscribe((event: PlayerLeaveAfterEvent) => {
  _Player.bye(event.playerId);
});

