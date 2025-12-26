// テスト用の型定義ファイル
// モックの型を定義して、VSCodeの型エラーを解消

declare module '@minecraft/server' {
  export enum GameMode {
    Adventure = 'Adventure',
    Creative = 'Creative',
    Spectator = 'Spectator',
    Survival = 'Survival'
  }

  export interface Vector3 {
    x: number;
    y: number;
    z: number;
  }

  export class Player {
    constructor(options?: {
      location?: Vector3;
      isSneaking?: boolean;
      gameMode?: GameMode;
    });
    readonly id: string;
    readonly name: string;
    readonly location: Vector3;
    isSneaking: boolean;
    getGameMode(): GameMode;
  }

  export class Block {
    constructor(options?: {
      dimension?: Dimension;
      typeId?: string;
      location?: Vector3;
    });
    readonly dimension: Dimension;
    readonly typeId: string;
    readonly location: Vector3;
    setPermutation(permutation: BlockPermutation): void;
  }

  export class BlockType {
    readonly id: string;
  }

  export class BlockPermutation {
    readonly type: BlockType;
    static resolve<T extends string = string>(
      blockName: T,
      states?: Record<string, any>
    ): BlockPermutation;
  }

  export class Dimension {
    constructor(options?: {
      id?: string;
    });
    readonly id: string;
    getBlock(location: Vector3): Block | undefined;
    spawnItem(itemStack: ItemStack, location: Vector3): Entity;
    runCommand(commandString: string): CommandResult;
  }

  export class ItemStack {
    constructor(itemType: ItemType | string, amount?: number);
    amount: number;
    readonly typeId: string;
    readonly type: ItemType;
  }

  export class ItemType {
    readonly id: string;
  }

  export class Entity {
    readonly id: string;
    readonly typeId: string;
  }

  export interface CommandResult {
    successCount: number;
  }

  export interface BlockBreakAfterEvent {
    readonly player: Player;
    readonly block: Block;
    readonly brokenBlockPermutation: BlockPermutation;
  }
}
