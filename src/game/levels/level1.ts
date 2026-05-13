import type { LevelData } from '../types';

export const LEVEL1: LevelData = {
  playerSpawn: { x: 80, y: 500 },
  platforms: [
    // Section 1 (x: 0–200)
    { x: 64,  y: 448, tileCount: 4 },
    // Section 2 (x: 200–400)
    { x: 224, y: 384, tileCount: 4 },
    { x: 320, y: 288, tileCount: 3 },
    // Section 3 (x: 400–600)
    { x: 416, y: 448, tileCount: 4 },
    { x: 512, y: 320, tileCount: 3 },
    // Section 4 (x: 600–800)
    { x: 608, y: 416, tileCount: 4 },
    { x: 672, y: 256, tileCount: 3 },
    { x: 736, y: 352, tileCount: 2 },
  ],
  coins: [
    { x: 64,  y: 416 }, { x: 96,  y: 416 }, { x: 128, y: 416 },
    { x: 224, y: 352 }, { x: 256, y: 352 }, { x: 288, y: 352 },
    { x: 320, y: 256 }, { x: 352, y: 256 }, { x: 384, y: 256 },
    { x: 416, y: 416 }, { x: 448, y: 416 }, { x: 480, y: 416 },
    { x: 512, y: 288 }, { x: 544, y: 288 }, { x: 576, y: 288 },
    { x: 608, y: 384 }, { x: 640, y: 384 }, { x: 672, y: 384 },
    { x: 672, y: 224 }, { x: 704, y: 224 }, { x: 736, y: 224 },
    { x: 736, y: 320 }, { x: 768, y: 320 },
  ],
};
