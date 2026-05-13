import type { LevelData } from '../types';

export const LEVEL1: LevelData = {
  playerSpawn: { x: 80, y: 500 },
  platforms: [
    // Section 1 (x: 0–800)
    { x: 192,  y: 448, tileCount: 4 },
    { x: 448,  y: 352, tileCount: 3 },
    { x: 640,  y: 416, tileCount: 4 },
    // Section 2 (x: 800–1600)
    { x: 832,  y: 288, tileCount: 4 },
    { x: 1056, y: 448, tileCount: 3 },
    { x: 1312, y: 352, tileCount: 4 },
    // Section 3 (x: 1600–2400)
    { x: 1600, y: 416, tileCount: 4 },
    { x: 1856, y: 256, tileCount: 5 },
    { x: 2144, y: 352, tileCount: 3 },
    // Section 4 (x: 2400–3200)
    { x: 2432, y: 448, tileCount: 4 },
    { x: 2720, y: 320, tileCount: 4 },
    { x: 3040, y: 384, tileCount: 4 },
  ],
  coins: [
    // Above section 1 platforms (y = platform.y - 32)
    { x: 192, y: 416 }, { x: 224, y: 416 }, { x: 256, y: 416 },
    { x: 448, y: 320 }, { x: 480, y: 320 },
    { x: 640, y: 384 }, { x: 672, y: 384 }, { x: 704, y: 384 },
    // Above section 2 platforms
    { x: 832,  y: 256 }, { x: 864,  y: 256 }, { x: 896,  y: 256 },
    { x: 1056, y: 416 }, { x: 1088, y: 416 },
    { x: 1312, y: 320 }, { x: 1344, y: 320 }, { x: 1376, y: 320 },
    // Above section 3 platforms
    { x: 1600, y: 384 }, { x: 1632, y: 384 }, { x: 1664, y: 384 },
    { x: 1856, y: 224 }, { x: 1888, y: 224 }, { x: 1920, y: 224 },
    { x: 2144, y: 320 }, { x: 2176, y: 320 },
    // Above section 4 platforms
    { x: 2432, y: 416 }, { x: 2464, y: 416 }, { x: 2496, y: 416 },
    { x: 2720, y: 288 }, { x: 2752, y: 288 }, { x: 2784, y: 288 },
    { x: 3040, y: 352 }, { x: 3072, y: 352 }, { x: 3104, y: 352 },
  ],
};
