import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('phaser', () => ({
  default: {
    Scene: class {},
  },
}));

import { Coin } from './Coin';

function makeImage() {
  return {
    destroy: vi.fn(),
  };
}

type FakeImage = ReturnType<typeof makeImage>;

function makeScene(image: FakeImage) {
  return {
    physics: {
      add: {
        staticImage: vi.fn().mockReturnValue(image),
      },
    },
  };
}

describe('Coin', () => {
  let image: FakeImage;

  beforeEach(() => {
    image = makeImage();
  });

  it('exposes the underlying image via gameObject', () => {
    const scene = makeScene(image);
    const coin = new Coin(scene as never, 100, 200);
    expect(coin.gameObject).toBe(image);
  });

  it('creates the staticImage at the given position with coin texture', () => {
    const scene = makeScene(image);
    new Coin(scene as never, 100, 200);
    expect(scene.physics.add.staticImage).toHaveBeenCalledWith(100, 200, 'coin');
  });

  it('is not collected initially', () => {
    const scene = makeScene(image);
    const coin = new Coin(scene as never, 100, 200);
    expect(coin.collected).toBe(false);
  });

  it('is collected after collect() is called', () => {
    const scene = makeScene(image);
    const coin = new Coin(scene as never, 100, 200);
    coin.collect();
    expect(coin.collected).toBe(true);
  });

  it('destroys the image when collected', () => {
    const scene = makeScene(image);
    const coin = new Coin(scene as never, 100, 200);
    coin.collect();
    expect(image.destroy).toHaveBeenCalledTimes(1);
  });

  it('does not destroy the image a second time when collect() is called again', () => {
    const scene = makeScene(image);
    const coin = new Coin(scene as never, 100, 200);
    coin.collect();
    coin.collect();
    expect(image.destroy).toHaveBeenCalledTimes(1);
  });

  it('remains collected after double collect()', () => {
    const scene = makeScene(image);
    const coin = new Coin(scene as never, 100, 200);
    coin.collect();
    coin.collect();
    expect(coin.collected).toBe(true);
  });

  it('collect() returns true on first call', () => {
    const scene = makeScene(image);
    const coin = new Coin(scene as never, 100, 200);
    expect(coin.collect()).toBe(true);
  });

  it('collect() returns false on subsequent calls', () => {
    const scene = makeScene(image);
    const coin = new Coin(scene as never, 100, 200);
    coin.collect();
    expect(coin.collect()).toBe(false);
  });
});
