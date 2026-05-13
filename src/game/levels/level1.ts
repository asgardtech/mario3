export const LEVEL1 = {
  playerSpawn: { x: 80, y: 500 },
  platforms: [
    // Section 1: easy opening
    { x: 192, y: 448, tileCount: 6 },
    { x: 512, y: 352, tileCount: 5 },
    // Section 2: rising staircase
    { x: 832, y: 416, tileCount: 6 },
    { x: 1088, y: 320, tileCount: 6 },
    { x: 1344, y: 448, tileCount: 4 },
    // Section 3: high-low variation
    { x: 1600, y: 352, tileCount: 5 },
    { x: 1856, y: 256, tileCount: 5 },
    { x: 2080, y: 384, tileCount: 5 },
    // Section 4: final approach
    { x: 2368, y: 320, tileCount: 5 },
    { x: 2624, y: 416, tileCount: 5 },
    { x: 2880, y: 288, tileCount: 5 },
    { x: 3104, y: 448, tileCount: 2 },
  ],
  coins: [
    { x: 240, y: 416 }, { x: 288, y: 416 }, { x: 336, y: 416 },
    { x: 560, y: 320 }, { x: 608, y: 320 }, { x: 656, y: 320 },
    { x: 880, y: 384 }, { x: 928, y: 384 }, { x: 976, y: 384 },
    { x: 1136, y: 288 }, { x: 1184, y: 288 }, { x: 1232, y: 288 },
    { x: 1392, y: 416 }, { x: 1440, y: 416 },
    { x: 1648, y: 320 }, { x: 1696, y: 320 },
    { x: 1904, y: 224 }, { x: 1952, y: 224 }, { x: 2000, y: 224 },
    { x: 2128, y: 352 }, { x: 2176, y: 352 },
    { x: 2416, y: 288 }, { x: 2464, y: 288 }, { x: 2512, y: 288 },
    { x: 2672, y: 384 }, { x: 2720, y: 384 },
    { x: 2928, y: 256 }, { x: 2976, y: 256 }, { x: 3024, y: 256 },
    { x: 3120, y: 416 },
  ],
};
