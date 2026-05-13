import type { LevelData } from '../types';

export const LEVEL1: LevelData = {
  playerSpawn: { x: 80, y: 500 },
  platforms: [
    // Q1 (x: 0–199)
    { x: 64,  y: 448, tileCount: 3 },
    { x: 128, y: 352, tileCount: 2 },
    { x: 192, y: 416, tileCount: 3 },
    // Q2 (x: 200–399)
    { x: 256, y: 288, tileCount: 3 },
    { x: 320, y: 448, tileCount: 2 },
    { x: 352, y: 352, tileCount: 3 },
    // Q3 (x: 400–599)
    { x: 416, y: 416, tileCount: 2 },
    { x: 480, y: 256, tileCount: 3 },
    { x: 544, y: 352, tileCount: 3 },
    // Q4 (x: 600–799)
    { x: 608, y: 448, tileCount: 2 },
    { x: 672, y: 320, tileCount: 3 },
    { x: 736, y: 384, tileCount: 2 },
  ],
  coins: [
    // Above Q1 platforms (coin.y = platform.y - 32)
    { x: 64,  y: 416 }, { x: 96,  y: 416 }, { x: 128, y: 416 },
    { x: 128, y: 320 }, { x: 160, y: 320 },
    { x: 192, y: 384 }, { x: 224, y: 384 }, { x: 256, y: 384 },
    // Above Q2 platforms
    { x: 256, y: 256 }, { x: 288, y: 256 }, { x: 320, y: 256 },
    { x: 320, y: 416 }, { x: 352, y: 416 },
    { x: 352, y: 320 }, { x: 384, y: 320 }, { x: 416, y: 320 },
    // Above Q3 platforms
    { x: 416, y: 384 }, { x: 448, y: 384 },
    { x: 480, y: 224 }, { x: 512, y: 224 }, { x: 544, y: 224 },
    { x: 544, y: 320 }, { x: 576, y: 320 }, { x: 608, y: 320 },
    // Above Q4 platforms
    { x: 608, y: 416 }, { x: 640, y: 416 },
    { x: 672, y: 288 }, { x: 704, y: 288 }, { x: 736, y: 288 },
    { x: 736, y: 352 }, { x: 768, y: 352 },
  ],
};
