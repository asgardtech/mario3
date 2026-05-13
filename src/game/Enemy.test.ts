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

import { Enemy } from './Enemy';
import { ENEMY_SPEED } from './constants';

function makeSprite(x = 100) {
  return {
    setCollideWorldBounds: vi.fn().mockReturnThis(),
    setVelocityX: vi.fn().mockReturnThis(),
    setFlipX: vi.fn().mockReturnThis(),
    destroy: vi.fn(),
    active: true,
    x,
  };
}

type FakeSprite = ReturnType<typeof makeSprite>;

function makeScene(sprite: FakeSprite) {
  return {
    physics: {
      add: {
        sprite: vi.fn().mockReturnValue(sprite),
      },
    },
  };
}

describe('Enemy', () => {
  let sprite: FakeSprite;

  beforeEach(() => {
    sprite = makeSprite();
  });

  it('exposes the underlying sprite via gameObject', () => {
    const scene = makeScene(sprite);
    const enemy = new Enemy(scene as never, 100, 300, 96);
    expect(enemy.gameObject).toBe(sprite);
  });

  it('creates the sprite at the given position with enemy texture', () => {
    const scene = makeScene(sprite);
    new Enemy(scene as never, 100, 300, 96);
    expect(scene.physics.add.sprite).toHaveBeenCalledWith(100, 300, 'enemy');
  });

  it('sets collide world bounds on the sprite', () => {
    const scene = makeScene(sprite);
    new Enemy(scene as never, 100, 300, 96);
    expect(sprite.setCollideWorldBounds).toHaveBeenCalledWith(true);
  });

  describe('patrol behavior', () => {
    it('moves right initially', () => {
      const scene = makeScene(sprite);
      const enemy = new Enemy(scene as never, 100, 300, 96);
      enemy.update();
      expect(sprite.setVelocityX).toHaveBeenCalledWith(ENEMY_SPEED);
    });

    it('does not flip sprite when moving right', () => {
      const scene = makeScene(sprite);
      const enemy = new Enemy(scene as never, 100, 300, 96);
      enemy.update();
      expect(sprite.setFlipX).toHaveBeenCalledWith(false);
    });

    it('reverses direction when reaching the right patrol boundary', () => {
      sprite = makeSprite(196); // x = startX + patrolDistance = 100 + 96
      const scene = makeScene(sprite);
      const enemy = new Enemy(scene as never, 100, 300, 96);
      enemy.update();
      expect(sprite.setVelocityX).toHaveBeenCalledWith(-ENEMY_SPEED);
    });

    it('flips sprite when moving left after reaching right boundary', () => {
      sprite = makeSprite(196);
      const scene = makeScene(sprite);
      const enemy = new Enemy(scene as never, 100, 300, 96);
      enemy.update();
      expect(sprite.setFlipX).toHaveBeenCalledWith(true);
    });

    it('reverses direction again when reaching the left patrol boundary', () => {
      sprite = makeSprite(196);
      const scene = makeScene(sprite);
      const enemy = new Enemy(scene as never, 100, 300, 96);
      enemy.update(); // reaches right boundary → direction = -1
      sprite.x = 100; // simulate moving back to start
      sprite.setVelocityX.mockClear();
      enemy.update(); // reaches left boundary → direction = 1
      expect(sprite.setVelocityX).toHaveBeenCalledWith(ENEMY_SPEED);
    });

    it('does not update when sprite is inactive', () => {
      const scene = makeScene(sprite);
      const enemy = new Enemy(scene as never, 100, 300, 96);
      sprite.active = false;
      enemy.update();
      expect(sprite.setVelocityX).not.toHaveBeenCalled();
    });

    it('continues patrolling within bounds when not at a boundary', () => {
      sprite = makeSprite(150); // x = 150, between 100 and 196
      const scene = makeScene(sprite);
      const enemy = new Enemy(scene as never, 100, 300, 96);
      enemy.update();
      expect(sprite.setVelocityX).toHaveBeenCalledWith(ENEMY_SPEED);
    });
  });

  describe('stomp defeat', () => {
    it('destroys the sprite when stomped', () => {
      const scene = makeScene(sprite);
      const enemy = new Enemy(scene as never, 100, 300, 96);
      enemy.stomp();
      expect(sprite.destroy).toHaveBeenCalled();
    });

    it('does not update after being stomped', () => {
      const scene = makeScene(sprite);
      const enemy = new Enemy(scene as never, 100, 300, 96);
      enemy.stomp();
      sprite.active = false; // simulate Phaser setting active=false on destroy
      sprite.setVelocityX.mockClear();
      enemy.update();
      expect(sprite.setVelocityX).not.toHaveBeenCalled();
    });
  });
});
