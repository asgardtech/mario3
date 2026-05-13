import { describe, it, expect, vi, beforeEach } from 'vitest';

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

import { Player, RUN_SPEED, JUMP_VELOCITY } from './Player';

function makeKey(isDown = false) {
  return { isDown };
}

function makeCursors(overrides: Partial<Record<'left' | 'right' | 'up' | 'space' | 'down' | 'shift', { isDown: boolean }>> = {}) {
  return {
    left: makeKey(),
    right: makeKey(),
    up: makeKey(),
    space: makeKey(),
    down: makeKey(),
    shift: makeKey(),
    ...overrides,
  };
}

function makeSprite(onGround = true) {
  return {
    setBounce: vi.fn().mockReturnThis(),
    setCollideWorldBounds: vi.fn().mockReturnThis(),
    setVelocityX: vi.fn().mockReturnThis(),
    setVelocityY: vi.fn().mockReturnThis(),
    setFlipX: vi.fn().mockReturnThis(),
    body: { blocked: { down: onGround } },
  };
}

type FakeSprite = ReturnType<typeof makeSprite>;
type FakeCursors = ReturnType<typeof makeCursors>;
type FakeWasd = Record<string, ReturnType<typeof makeKey>>;

function makeScene(sprite: FakeSprite, cursors: FakeCursors, wasd: FakeWasd) {
  return {
    physics: {
      add: {
        sprite: vi.fn().mockReturnValue(sprite),
      },
    },
    input: {
      keyboard: {
        createCursorKeys: vi.fn().mockReturnValue(cursors),
        addKey: vi.fn().mockImplementation((code: number) => {
          if (code === 87) return wasd.up;
          if (code === 65) return wasd.left;
          if (code === 68) return wasd.right;
          return makeKey();
        }),
      },
    },
  };
}

describe('Player', () => {
  let sprite: FakeSprite;
  let cursors: FakeCursors;
  let wasd: FakeWasd;

  beforeEach(() => {
    sprite = makeSprite(true);
    cursors = makeCursors();
    wasd = { up: makeKey(), left: makeKey(), right: makeKey() };
  });

  it('exposes the underlying sprite via gameObject', () => {
    const scene = makeScene(sprite, cursors, wasd);
    const player = new Player(scene as never, 80, 500);
    expect(player.gameObject).toBe(sprite);
  });

  it('creates the sprite at the given position', () => {
    const scene = makeScene(sprite, cursors, wasd);
    new Player(scene as never, 80, 500);
    expect(scene.physics.add.sprite).toHaveBeenCalledWith(80, 500, 'player');
  });

  it('sets bounce and world bounds on the sprite', () => {
    const scene = makeScene(sprite, cursors, wasd);
    new Player(scene as never, 80, 500);
    expect(sprite.setBounce).toHaveBeenCalledWith(0.1);
    expect(sprite.setCollideWorldBounds).toHaveBeenCalledWith(true);
  });

  describe('run controls', () => {
    it('moves left at RUN_SPEED when left arrow is pressed', () => {
      cursors.left.isDown = true;
      const scene = makeScene(sprite, cursors, wasd);
      const player = new Player(scene as never, 80, 500);
      player.update();
      expect(sprite.setVelocityX).toHaveBeenCalledWith(-RUN_SPEED);
    });

    it('moves right at RUN_SPEED when right arrow is pressed', () => {
      cursors.right.isDown = true;
      const scene = makeScene(sprite, cursors, wasd);
      const player = new Player(scene as never, 80, 500);
      player.update();
      expect(sprite.setVelocityX).toHaveBeenCalledWith(RUN_SPEED);
    });

    it('moves left when A key is pressed', () => {
      wasd.left.isDown = true;
      const scene = makeScene(sprite, cursors, wasd);
      const player = new Player(scene as never, 80, 500);
      player.update();
      expect(sprite.setVelocityX).toHaveBeenCalledWith(-RUN_SPEED);
    });

    it('moves right when D key is pressed', () => {
      wasd.right.isDown = true;
      const scene = makeScene(sprite, cursors, wasd);
      const player = new Player(scene as never, 80, 500);
      player.update();
      expect(sprite.setVelocityX).toHaveBeenCalledWith(RUN_SPEED);
    });

    it('stops when no horizontal key is pressed', () => {
      const scene = makeScene(sprite, cursors, wasd);
      const player = new Player(scene as never, 80, 500);
      player.update();
      expect(sprite.setVelocityX).toHaveBeenCalledWith(0);
    });

    it('flips sprite left when moving left', () => {
      cursors.left.isDown = true;
      const scene = makeScene(sprite, cursors, wasd);
      const player = new Player(scene as never, 80, 500);
      player.update();
      expect(sprite.setFlipX).toHaveBeenCalledWith(true);
    });

    it('unflips sprite when moving right', () => {
      cursors.right.isDown = true;
      const scene = makeScene(sprite, cursors, wasd);
      const player = new Player(scene as never, 80, 500);
      player.update();
      expect(sprite.setFlipX).toHaveBeenCalledWith(false);
    });
  });

  describe('jump controls', () => {
    it('jumps when up arrow is pressed and on ground', () => {
      cursors.up.isDown = true;
      const scene = makeScene(sprite, cursors, wasd);
      const player = new Player(scene as never, 80, 500);
      player.update();
      expect(sprite.setVelocityY).toHaveBeenCalledWith(JUMP_VELOCITY);
    });

    it('jumps when space is pressed and on ground', () => {
      cursors.space.isDown = true;
      const scene = makeScene(sprite, cursors, wasd);
      const player = new Player(scene as never, 80, 500);
      player.update();
      expect(sprite.setVelocityY).toHaveBeenCalledWith(JUMP_VELOCITY);
    });

    it('jumps when W key is pressed and on ground', () => {
      wasd.up.isDown = true;
      const scene = makeScene(sprite, cursors, wasd);
      const player = new Player(scene as never, 80, 500);
      player.update();
      expect(sprite.setVelocityY).toHaveBeenCalledWith(JUMP_VELOCITY);
    });

    it('does not jump when already in the air', () => {
      sprite = makeSprite(false);
      cursors.up.isDown = true;
      const scene = makeScene(sprite, cursors, wasd);
      const player = new Player(scene as never, 80, 500);
      player.update();
      expect(sprite.setVelocityY).not.toHaveBeenCalled();
    });

    it('does not jump when no jump key is pressed', () => {
      const scene = makeScene(sprite, cursors, wasd);
      const player = new Player(scene as never, 80, 500);
      player.update();
      expect(sprite.setVelocityY).not.toHaveBeenCalled();
    });
  });
});
