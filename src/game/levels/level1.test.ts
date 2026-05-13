import { describe, it, expect } from 'vitest';
import { LEVEL1 } from './level1';
import { TILE_SIZE, LEVEL_WIDTH, LEVEL_HEIGHT, GROUND_Y } from '../constants';

describe('level constants', () => {
  it('LEVEL_WIDTH matches the 800px canvas (non-scrolling level)', () => {
    expect(LEVEL_WIDTH).toBe(800);
  });

  it('LEVEL_HEIGHT matches the viewport height', () => {
    expect(LEVEL_HEIGHT).toBe(600);
  });

  it('GROUND_Y is near the bottom of the level', () => {
    expect(GROUND_Y).toBeGreaterThan(LEVEL_HEIGHT - 40);
    expect(GROUND_Y).toBeLessThan(LEVEL_HEIGHT);
  });
});

describe('LEVEL1.playerSpawn', () => {
  it('is defined with numeric x and y', () => {
    expect(typeof LEVEL1.playerSpawn.x).toBe('number');
    expect(typeof LEVEL1.playerSpawn.y).toBe('number');
  });

  it('is at exactly (80, 500)', () => {
    expect(LEVEL1.playerSpawn.x).toBe(80);
    expect(LEVEL1.playerSpawn.y).toBe(500);
  });

  it('is above the ground and within level bounds', () => {
    expect(LEVEL1.playerSpawn.y).toBeLessThan(GROUND_Y);
    expect(LEVEL1.playerSpawn.x).toBeGreaterThanOrEqual(0);
    expect(LEVEL1.playerSpawn.x).toBeLessThanOrEqual(LEVEL_WIDTH);
  });
});

describe('LEVEL1.platforms', () => {
  it('defines at least 12 platform groups', () => {
    expect(LEVEL1.platforms.length).toBeGreaterThanOrEqual(12);
  });

  it('each entry has a positive tileCount', () => {
    for (const { tileCount } of LEVEL1.platforms) {
      expect(tileCount).toBeGreaterThan(0);
    }
  });

  it('each xStart is tile-aligned (multiple of 32), except x=50 which is required by spec', () => {
    for (const { x } of LEVEL1.platforms) {
      if (x === 50) continue;
      expect(x % 32).toBe(0);
    }
  });

  it('all platforms are above the ground (y < GROUND_Y)', () => {
    for (const { y } of LEVEL1.platforms) {
      expect(y).toBeLessThan(GROUND_Y);
    }
  });

  it('all platforms are within the level width', () => {
    for (const { x, tileCount } of LEVEL1.platforms) {
      expect(x).toBeGreaterThanOrEqual(0);
      expect(x + (tileCount - 1) * TILE_SIZE).toBeLessThanOrEqual(LEVEL_WIDTH);
    }
  });

  it('platforms span the full level (last platform ends near LEVEL_WIDTH)', () => {
    const maxEnd = Math.max(...LEVEL1.platforms.map(({ x, tileCount }) => x + (tileCount - 1) * TILE_SIZE));
    expect(maxEnd).toBeGreaterThan(LEVEL_WIDTH * 0.9);
  });

  it('platforms cover all four quarters of the level', () => {
    const quarterWidth = LEVEL_WIDTH / 4;
    const sections = [0, 1, 2, 3].map(i =>
      LEVEL1.platforms.some(({ x }) => x >= i * quarterWidth && x < (i + 1) * quarterWidth)
    );
    expect(sections.every(Boolean)).toBe(true);
  });
});

describe('LEVEL1.coins', () => {
  it('defines at least 30 coins', () => {
    expect(LEVEL1.coins.length).toBeGreaterThanOrEqual(30);
  });

  it('all coins are within level bounds', () => {
    for (const { x, y } of LEVEL1.coins) {
      expect(x).toBeGreaterThanOrEqual(0);
      expect(x).toBeLessThanOrEqual(LEVEL_WIDTH);
      expect(y).toBeGreaterThan(0);
      expect(y).toBeLessThan(GROUND_Y);
    }
  });

  it('every coin is exactly one tile above a platform and within its x-span', () => {
    for (const coin of LEVEL1.coins) {
      const platform = LEVEL1.platforms.find(
        p =>
          p.y === coin.y + TILE_SIZE &&
          coin.x >= p.x &&
          coin.x <= p.x + (p.tileCount - 1) * TILE_SIZE,
      );
      expect(platform).toBeDefined();
    }
  });

  it('coins are distributed across both halves of the level', () => {
    const firstHalf = LEVEL1.coins.filter(({ x }) => x < LEVEL_WIDTH / 2);
    const secondHalf = LEVEL1.coins.filter(({ x }) => x >= LEVEL_WIDTH / 2);
    expect(firstHalf.length).toBeGreaterThan(0);
    expect(secondHalf.length).toBeGreaterThan(0);
  });
});

describe('ground layout (derived from constants)', () => {
  it('ground tiles start at x=16 and span the full level width', () => {
    const tiles: number[] = [];
    for (let x = TILE_SIZE / 2; x < LEVEL_WIDTH; x += TILE_SIZE) {
      tiles.push(x);
    }
    expect(tiles[0]).toBe(TILE_SIZE / 2);
    expect(tiles[tiles.length - 1]).toBe(LEVEL_WIDTH - TILE_SIZE / 2);
    expect(tiles.length).toBe(Math.floor(LEVEL_WIDTH / TILE_SIZE));
  });
});
