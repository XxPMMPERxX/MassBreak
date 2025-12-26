// Mock implementation of @minecraft/server for testing
// Based on @minecraft/server v2.5.0-beta type definitions

/**
 * Specifies the different game modes that can be set for a player.
 */
export enum GameMode {
  /**
   * World is in a more locked-down experience, where blocks may not be manipulated.
   */
  Adventure = 'Adventure',
  /**
   * World is in a full creative mode.
   */
  Creative = 'Creative',
  /**
   * World is in spectator mode.
   */
  Spectator = 'Spectator',
  /**
   * World is in a survival mode, where players take damage and entities may not be peaceful.
   */
  Survival = 'Survival'
}

/**
 * Represents a 3D vector with x, y, and z components.
 */
export interface Vector3 {
  x: number;
  y: number;
  z: number;
}

/**
 * Mock BlockType for testing
 */
export class BlockType {
  private constructor() {}
  readonly id: string = 'minecraft:air';
}

/**
 * Mock Block for testing
 */
export class Block {
  readonly dimension: Dimension;
  readonly typeId: string;
  readonly location: Vector3;

  constructor(options?: {
    dimension?: Dimension;
    typeId?: string;
    location?: Vector3;
  }) {
    this.dimension = options?.dimension ?? new Dimension();
    this.typeId = options?.typeId ?? 'minecraft:air';
    this.location = options?.location ?? { x: 0, y: 0, z: 0 };
  }

  /**
   * Sets the block permutation.
   */
  setPermutation(_permutation: BlockPermutation): void {
    // Mock implementation - does nothing in tests
  }
}

/**
 * Mock BlockPermutation for testing
 */
export class BlockPermutation {
  readonly type: BlockType;
  private readonly blockName: string;

  private constructor(blockName: string) {
    this.blockName = blockName;
    this.type = { id: blockName } as BlockType;
  }

  /**
   * Creates a BlockPermutation from a block type string.
   */
  static resolve<T extends string = string>(
    blockName: T,
    _states?: Record<string, any>
  ): BlockPermutation {
    return new BlockPermutation(blockName);
  }
}

/**
 * Mock ItemType for testing
 */
export class ItemType {
  private constructor() {}
  readonly id: string = 'minecraft:stone';
}

/**
 * Mock ItemStack for testing
 */
export class ItemStack {
  amount: number;
  readonly typeId: string;
  readonly type!: ItemType;

  /**
   * Creates a new instance of a stack of items for use in the world.
   * @param itemType - Type of item to create (ItemType or string)
   * @param amount - Number of items to place in the stack, between 1-255 (default: 1)
   */
  constructor(itemType: ItemType | string, amount: number = 1) {
    this.typeId = typeof itemType === 'string' ? itemType : itemType.id;
    this.amount = amount;
  }
}

/**
 * Mock Entity for testing
 */
export class Entity {
  readonly id: string = 'mock-entity';
  readonly typeId: string = 'minecraft:item';

  constructor() {
    // Mock constructor - normally private in real API
  }
}

/**
 * Mock CommandResult for testing
 */
export interface CommandResult {
  successCount: number;
}

/**
 * Mock Dimension for testing
 */
export class Dimension {
  readonly id: string;

  constructor(options?: {
    id?: string;
  }) {
    this.id = options?.id ?? 'minecraft:overworld';
  }

  /**
   * Returns the block at the given location.
   */
  getBlock(_location: Vector3): Block | undefined {
    return undefined;
  }

  /**
   * Spawns an item entity at the given location.
   */
  spawnItem(_itemStack: ItemStack, _location: Vector3): Entity {
    return new Entity();
  }

  /**
   * Runs a command and returns the result.
   */
  runCommand(_commandString: string): CommandResult {
    return { successCount: 1 };
  }
}

/**
 * Mock Player for testing
 */
export class Player {
  readonly id: string = 'mock-player';
  readonly name: string = 'TestPlayer';
  readonly location: Vector3;
  isSneaking: boolean;
  private gameMode: GameMode;

  constructor(options?: {
    location?: Vector3;
    isSneaking?: boolean;
    gameMode?: GameMode;
  }) {
    this.location = options?.location ?? { x: 0, y: 64, z: 0 };
    this.isSneaking = options?.isSneaking ?? false;
    this.gameMode = options?.gameMode ?? GameMode.Survival;
  }

  getGameMode(): GameMode {
    return this.gameMode;
  }
}

/**
 * Mock BlockBreakAfterEvent for testing
 */
export interface BlockBreakAfterEvent {
  readonly player: Player;
  readonly block: Block;
  readonly brokenBlockPermutation: BlockPermutation;
}
