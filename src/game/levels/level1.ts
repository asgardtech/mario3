import type { LevelData } from '../types';

export const LEVEL1: LevelData = {
  playerSpawn: { x: 80, y: 500 },
  enemies: [
    // On platform { x: 128, y: 320, tileCount: 3 } — top=310, enemy.y=296, patrol to x=192
    { x: 128, y: 296, patrolDistance: 64 },
    // On platform { x: 288, y: 288, tileCount: 4 } — top=278, enemy.y=264, patrol to x=384
    { x: 288, y: 264, patrolDistance: 96 },
    // On platform { x: 480, y: 256, tileCount: 4 } — top=246, enemy.y=232, patrol to x=576
    { x: 480, y: 232, patrolDistance: 96 },
    // On ground (GROUND_Y=576) — ground top=560, enemy.y=546, patrol x=200..328
    { x: 200, y: 546, patrolDistance: 128 },
  ],
  platforms: [
    // Quarter 0 (x: 0–199)
    { x: 50,  y: 420, tileCount: 7 }, // required by spec (x=50 is not tile-aligned by design)
    { x: 128, y: 320, tileCount: 3 },
    // Quarter 1 (x: 200–399)
    { x: 224, y: 384, tileCount: 3 },
    { x: 288, y: 288, tileCount: 4 },
    { x: 352, y: 448, tileCount: 3 },
    // Quarter 2 (x: 400–599)
    { x: 416, y: 352, tileCount: 3 },
    { x: 480, y: 256, tileCount: 4 },
    { x: 544, y: 416, tileCount: 3 },
    // Quarter 3 (x: 600–799)
    { x: 608, y: 320, tileCount: 3 },
    { x: 672, y: 448, tileCount: 3 },
    { x: 704, y: 288, tileCount: 3 },
    { x: 736, y: 384, tileCount: 2 },
  ],
  coins: [
    // Above quarter 0 platforms (coin.y = platform.y - 32)
    { x: 50,  y: 388 }, { x: 82,  y: 388 }, { x: 114, y: 388 },
    { x: 128, y: 288 }, { x: 160, y: 288 }, { x: 192, y: 288 },
    // Above quarter 1 platforms
    { x: 224, y: 352 }, { x: 256, y: 352 }, { x: 288, y: 352 },
    { x: 288, y: 256 }, { x: 320, y: 256 }, { x: 352, y: 256 },
    { x: 352, y: 416 }, { x: 384, y: 416 }, { x: 416, y: 416 },
    // Above quarter 2 platforms
    { x: 416, y: 320 }, { x: 448, y: 320 }, { x: 480, y: 320 },
    { x: 480, y: 224 }, { x: 512, y: 224 }, { x: 544, y: 224 },
    { x: 544, y: 384 }, { x: 576, y: 384 }, { x: 608, y: 384 },
    // Above quarter 3 platforms
    { x: 608, y: 288 }, { x: 640, y: 288 }, { x: 672, y: 288 },
    { x: 672, y: 416 }, { x: 704, y: 416 }, { x: 736, y: 416 },
    { x: 704, y: 256 }, { x: 736, y: 256 }, { x: 768, y: 256 },
    { x: 736, y: 352 }, { x: 768, y: 352 },
  ],
};
