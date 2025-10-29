import { Player, PlayerLeaveAfterEvent, PlayerSpawnAfterEvent, world } from '@minecraft/server';
import { _Vector3 } from '../math/vector3';
import { delegate } from '../utils/delegate';

export type WrappedPlayer = _Player & Player;

export class PlayerRegistry {
  /**
   * 取得
   * @param {Player} player
   * @returns {WrappedPlayer}
   */
  static get(player: Player): WrappedPlayer {
    if (!_Player._players.has(player.id)) _Player.hello(player);
    return _Player._players.get(player.id) as WrappedPlayer;
  }
}

class _Player {
  static _players: Map<string, WrappedPlayer> = new Map();

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
