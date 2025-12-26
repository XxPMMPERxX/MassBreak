export const MASS_BREAK_CONFIG = {
  MAX_BLOCKS: 64,
  REQUIRE_SNEAK: true,
  BATCH_SIZE: 16,
  BATCH_DELAY_TICKS: 1
} as const;

/**
 * 一括破壊の対象となるブロックタイプ（木関連のみ）
 */
export const ALLOWED_BLOCK_TYPES = new Set([
  // 原木（各種）
  'minecraft:oak_log',
  'minecraft:spruce_log',
  'minecraft:birch_log',
  'minecraft:jungle_log',
  'minecraft:acacia_log',
  'minecraft:dark_oak_log',
  'minecraft:mangrove_log',
  'minecraft:cherry_log',
  'minecraft:crimson_stem',
  'minecraft:warped_stem',

  // 木材（皮付き原木）
  'minecraft:oak_wood',
  'minecraft:spruce_wood',
  'minecraft:birch_wood',
  'minecraft:jungle_wood',
  'minecraft:acacia_wood',
  'minecraft:dark_oak_wood',
  'minecraft:mangrove_wood',
  'minecraft:cherry_wood',
  'minecraft:crimson_hyphae',
  'minecraft:warped_hyphae',

  // 剥いだ原木
  'minecraft:stripped_oak_log',
  'minecraft:stripped_spruce_log',
  'minecraft:stripped_birch_log',
  'minecraft:stripped_jungle_log',
  'minecraft:stripped_acacia_log',
  'minecraft:stripped_dark_oak_log',
  'minecraft:stripped_mangrove_log',
  'minecraft:stripped_cherry_log',
  'minecraft:stripped_crimson_stem',
  'minecraft:stripped_warped_stem',

  // 剥いだ木材
  'minecraft:stripped_oak_wood',
  'minecraft:stripped_spruce_wood',
  'minecraft:stripped_birch_wood',
  'minecraft:stripped_jungle_wood',
  'minecraft:stripped_acacia_wood',
  'minecraft:stripped_dark_oak_wood',
  'minecraft:stripped_mangrove_wood',
  'minecraft:stripped_cherry_wood',
  'minecraft:stripped_crimson_hyphae',
  'minecraft:stripped_warped_hyphae',
]);
