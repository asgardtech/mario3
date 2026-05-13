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

import { Player } from './Player';
import {
  PLAYER_SPEED,
  PLAYER_JUMP_VELOCITY,
  PLAYER_DRAG_X,
  PLAYER_JUMP_HOLD_FRAMES,
  PLAYER_JUMP_HOLD,
  COYOTE_FRAMES,
} from './constants';

// Keep legacy aliases so existing assertion messages stay readable
const RUN_SPEED = PLAYER_SPEED;
const JUMP_VELOCITY = PLAYER_JUMP_VELOCITY;

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
    setDragX: vi.fn().mockReturnThis(),
    setVelocityX: vi.fn().mockReturnThis(),
    setVelocityY: vi.fn().mockReturnThis(),
    setFlipX: vi.fn().mockReturnThis(),
    body: {
      blocked: { down: onGround },
    },
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

  it('sets dragX for friction-based deceleration', () => {
    const scene = makeScene(sprite, cursors, wasd);
    new Player(scene as never, 80, 500);
    expect(sprite.setDragX).toHaveBeenCalledWith(PLAYER_DRAG_X);
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

    it('does not snap velocity to zero when no horizontal key is pressed (drag handles deceleration)', () => {
      const scene = makeScene(sprite, cursors, wasd);
      const player = new Player(scene as never, 80, 500);
      player.update();
      expect(sprite.setVelocityX).not.toHaveBeenCalled();
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

  describe('hold-to-extend jump', () => {
    it('applies hold bonus on subsequent frames while jump key is held in air', () => {
      cursors.up.isDown = true;
      const scene = makeScene(sprite, cursors, wasd);
      const player = new Player(scene as never, 80, 500);

      // Frame 1: initial jump from ground
      player.update();
      expect(sprite.setVelocityY).toHaveBeenCalledWith(PLAYER_JUMP_VELOCITY);

      // Now in the air
      sprite.body.blocked.down = false;
      sprite.setVelocityY.mockClear();

      // Frame 2: first hold frame adds PLAYER_JUMP_HOLD to base
      player.update();
      expect(sprite.setVelocityY).toHaveBeenCalledWith(PLAYER_JUMP_VELOCITY + PLAYER_JUMP_HOLD);
    });

    it('accumulates hold bonus each frame up to PLAYER_JUMP_HOLD_FRAMES', () => {
      cursors.up.isDown = true;
      const scene = makeScene(sprite, cursors, wasd);
      const player = new Player(scene as never, 80, 500);

      // Initial jump
      player.update();
      sprite.body.blocked.down = false;

      // Advance through all hold frames and verify the final accumulated velocity
      for (let i = 1; i < PLAYER_JUMP_HOLD_FRAMES - 1; i++) {
        player.update();
      }
      sprite.setVelocityY.mockClear();

      // Last valid hold frame (jumpHoldFrames === PLAYER_JUMP_HOLD_FRAMES - 1)
      player.update();
      expect(sprite.setVelocityY).toHaveBeenCalledWith(
        PLAYER_JUMP_VELOCITY + (PLAYER_JUMP_HOLD_FRAMES - 1) * PLAYER_JUMP_HOLD,
      );
    });

    it('stops applying hold bonus after PLAYER_JUMP_HOLD_FRAMES frames', () => {
      cursors.up.isDown = true;
      const scene = makeScene(sprite, cursors, wasd);
      const player = new Player(scene as never, 80, 500);

      // Initial jump then exhaust all hold frames
      player.update();
      sprite.body.blocked.down = false;
      for (let i = 0; i < PLAYER_JUMP_HOLD_FRAMES; i++) {
        player.update();
      }

      // One more frame — hold frames exhausted, no velocity set
      sprite.setVelocityY.mockClear();
      player.update();
      expect(sprite.setVelocityY).not.toHaveBeenCalled();
    });

    it('stops applying hold bonus when jump key is released', () => {
      cursors.up.isDown = true;
      const scene = makeScene(sprite, cursors, wasd);
      const player = new Player(scene as never, 80, 500);

      // Initial jump
      player.update();
      sprite.body.blocked.down = false;

      // One hold frame
      player.update();

      // Release key
      cursors.up.isDown = false;
      sprite.setVelocityY.mockClear();
      player.update();
      expect(sprite.setVelocityY).not.toHaveBeenCalled();
    });
  });

  describe('coyote time', () => {
    it('allows jumping within COYOTE_FRAMES frames after leaving the ground', () => {
      const scene = makeScene(sprite, cursors, wasd);
      const player = new Player(scene as never, 80, 500);

      // One frame on ground (no jump) to populate coyote counter
      player.update();

      // Leave ground
      sprite.body.blocked.down = false;

      // Advance COYOTE_FRAMES - 1 frames without jumping (still within window)
      for (let i = 0; i < COYOTE_FRAMES - 1; i++) {
        player.update();
      }

      // Jump should still succeed
      cursors.up.isDown = true;
      sprite.setVelocityY.mockClear();
      player.update();
      expect(sprite.setVelocityY).toHaveBeenCalledWith(PLAYER_JUMP_VELOCITY);
    });

    it('does not allow jumping after COYOTE_FRAMES frames since leaving the ground', () => {
      const scene = makeScene(sprite, cursors, wasd);
      const player = new Player(scene as never, 80, 500);

      // One frame on ground to populate coyote counter
      player.update();

      // Leave ground and exhaust all coyote frames
      sprite.body.blocked.down = false;
      for (let i = 0; i < COYOTE_FRAMES; i++) {
        player.update();
      }

      // Jump attempt should fail
      cursors.up.isDown = true;
      sprite.setVelocityY.mockClear();
      player.update();
      expect(sprite.setVelocityY).not.toHaveBeenCalled();
    });
  });
});
