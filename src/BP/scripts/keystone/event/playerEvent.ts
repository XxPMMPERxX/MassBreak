/* eslint-disable @typescript-eslint/no-unused-vars */

import { 
  BlockComponentPlayerBreakEvent,
  BlockComponentPlayerInteractEvent,
  BlockComponentPlayerPlaceBeforeEvent,
  PlayerBreakBlockAfterEvent,
  PlayerBreakBlockBeforeEvent,
  PlayerButtonInputAfterEvent,
  PlayerDimensionChangeAfterEvent,
  PlayerEmoteAfterEvent,
  PlayerGameModeChangeAfterEvent,
  PlayerGameModeChangeBeforeEvent,
  PlayerHotbarSelectedSlotChangeAfterEvent,
  PlayerInputModeChangeAfterEvent,
  PlayerInputPermissionCategoryChangeAfterEvent,
  PlayerInteractWithBlockAfterEvent,
  PlayerInteractWithBlockBeforeEvent,
  PlayerInteractWithEntityAfterEvent,
  PlayerInteractWithEntityBeforeEvent,
  PlayerInventoryItemChangeAfterEvent,
  PlayerJoinAfterEvent,
  PlayerLeaveAfterEvent,
  PlayerLeaveBeforeEvent,
  PlayerPlaceBlockAfterEvent,
  PlayerSpawnAfterEvent
} from '@minecraft/server';
import { KeystonePlayer } from '../entity/player';
import { Listener } from './event';

abstract class PlayerEvent implements Listener {
  onJoinAfter(event: PlayerJoinAfterEvent): void {}
  onLeaveAfter(event: PlayerLeaveAfterEvent): void {}

  onLeaveBefore(event: PlayerLeaveBeforeEvent, player: KeystonePlayer): void {}
  onBreakBlockBefore(event: PlayerBreakBlockBeforeEvent, player: KeystonePlayer): void {}
  onGameModeChangeBefore(event: PlayerGameModeChangeBeforeEvent, player: KeystonePlayer): void {}
  onPlayerInteractWithBlockBefore(event: PlayerInteractWithBlockBeforeEvent, player: KeystonePlayer): void {}
  onPlayerInteractWithEntityBefore(event: PlayerInteractWithEntityBeforeEvent, player: KeystonePlayer): void {}

  onBlockComponentPlayerPlaceBefore(event: BlockComponentPlayerPlaceBeforeEvent, player?: KeystonePlayer): void {}
  onBlockComponentPlayerInteract(event: BlockComponentPlayerInteractEvent, player?: KeystonePlayer): void {}
  onBlockComponentPlayerBreak(event: BlockComponentPlayerBreakEvent, player?: KeystonePlayer): void {}

  onEmoteAfter(event: PlayerEmoteAfterEvent, player: KeystonePlayer): void {}
  onSpawnAfter(event: PlayerSpawnAfterEvent, player: KeystonePlayer): void {}
  onBreakBlockAfter(event: PlayerBreakBlockAfterEvent, player: KeystonePlayer): void {}
  onPlaceBlockAfter(event: PlayerPlaceBlockAfterEvent, player: KeystonePlayer): void {}
  onButtonInputAfter(event: PlayerButtonInputAfterEvent, player: KeystonePlayer): void {}
  onGameModeChangeAfter(event: PlayerGameModeChangeAfterEvent, player: KeystonePlayer): void {}
  onDimensionChangeAfter(event: PlayerDimensionChangeAfterEvent, player: KeystonePlayer): void {}
  onInputModeChangeAfter(event: PlayerInputModeChangeAfterEvent, player: KeystonePlayer): void {}
  onInteractWithBlockAfter(event: PlayerInteractWithBlockAfterEvent, player: KeystonePlayer): void {}
  onInteractWithEntityAfter(event: PlayerInteractWithEntityAfterEvent, player: KeystonePlayer): void {}
  onInventoryItemChangeAfter(event: PlayerInventoryItemChangeAfterEvent, player: KeystonePlayer): void {}
  onHotbarSelectedSlotChangeAfter(event: PlayerHotbarSelectedSlotChangeAfterEvent, player: KeystonePlayer): void {}
  onInputPermissionCategoryChangeAfter(event: PlayerInputPermissionCategoryChangeAfterEvent, player: KeystonePlayer): void {}
}
