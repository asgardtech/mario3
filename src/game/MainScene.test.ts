import { describe, it, expect, vi } from 'vitest';

vi.mock('phaser', () => ({
  default: {
    AUTO: 1,
    Scene: class {},
    Input: {
      Keyboard: {
        KeyCodes: { W: 87, A: 65, D: 68 },
      },
    },
  },
}));

import { PLATFORM_LAYOUT, COIN_POSITIONS } from './MainScene';
import { LEVEL_WIDTH, LEVEL_HEIGHT, GROUND_Y } from './constants';

describe('level constants', () => {
  it('LEVEL_WIDTH is wider than the viewport', () => {
    expect(LEVEL_WIDTH).toBeGreaterThan(800);
  });

  it('LEVEL_HEIGHT matches the viewport height', () => {
    expect(LEVEL_HEIGHT).toBe(600);
  });

  it('GROUND_Y is near the bottom of the level', () => {
    expect(GROUND_Y).toBeGreaterThan(LEVEL_HEIGHT - 40);
    expect(GROUND_Y).toBeLessThan(LEVEL_HEIGHT);
  });
});

describe('PLATFORM_LAYOUT', () => {
  it('defines at least 8 platform groups', () => {
    expect(PLATFORM_LAYOUT.length).toBeGreaterThanOrEqual(8);
  });

  it('each entry has [xStart, xEnd, y] with xStart < xEnd', () => {
    for (const [xStart, xEnd] of PLATFORM_LAYOUT) {
      expect(xStart).toBeLessThan(xEnd);
    }
  });

  it('each platform xEnd is a multiple of 32 away from xStart (tile-aligned)', () => {
    for (const [xStart, xEnd] of PLATFORM_LAYOUT) {
      expect((xEnd - xStart) % 32).toBe(0);
    }
  });

  it('all platforms are above the ground (y < GROUND_Y)', () => {
    for (const [, , y] of PLATFORM_LAYOUT) {
      expect(y).toBeLessThan(GROUND_Y);
    }
  });

  it('all platforms are within the level width', () => {
    for (const [xStart, xEnd] of PLATFORM_LAYOUT) {
      expect(xStart).toBeGreaterThanOrEqual(0);
      expect(xEnd).toBeLessThanOrEqual(LEVEL_WIDTH);
    }
  });

  it('platforms span the full level (last platform ends near LEVEL_WIDTH)', () => {
    const maxEnd = Math.max(...PLATFORM_LAYOUT.map(([, xEnd]) => xEnd));
    expect(maxEnd).toBeGreaterThan(LEVEL_WIDTH * 0.9);
  });

  it('platforms cover all four quarters of the level', () => {
    const quarterWidth = LEVEL_WIDTH / 4;
    const sections = [0, 1, 2, 3].map(i =>
      PLATFORM_LAYOUT.some(([xStart]) => xStart >= i * quarterWidth && xStart < (i + 1) * quarterWidth)
    );
    expect(sections.every(Boolean)).toBe(true);
  });
});

describe('COIN_POSITIONS', () => {
  it('defines at least 20 coins', () => {
    expect(COIN_POSITIONS.length).toBeGreaterThanOrEqual(20);
  });

  it('all coins are within level bounds', () => {
    for (const [x, y] of COIN_POSITIONS) {
      expect(x).toBeGreaterThanOrEqual(0);
      expect(x).toBeLessThanOrEqual(LEVEL_WIDTH);
      expect(y).toBeGreaterThan(0);
      expect(y).toBeLessThan(GROUND_Y);
    }
  });

  it('coins are distributed across both halves of the level', () => {
    const firstHalf = COIN_POSITIONS.filter(([x]) => x < LEVEL_WIDTH / 2);
    const secondHalf = COIN_POSITIONS.filter(([x]) => x >= LEVEL_WIDTH / 2);
    expect(firstHalf.length).toBeGreaterThan(0);
    expect(secondHalf.length).toBeGreaterThan(0);
  });
});
