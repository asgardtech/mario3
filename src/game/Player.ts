import Phaser from 'phaser';
import {
  PLAYER_SPEED,
  PLAYER_JUMP_VELOCITY,
  PLAYER_DRAG_X,
  PLAYER_JUMP_HOLD_FRAMES,
  PLAYER_JUMP_HOLD,
  COYOTE_FRAMES,
} from './constants';

export { PLAYER_SPEED as RUN_SPEED, PLAYER_JUMP_VELOCITY as JUMP_VELOCITY };

export class Player {
  private sprite: Phaser.Physics.Arcade.Sprite;
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasd: {
    up: Phaser.Input.Keyboard.Key;
    left: Phaser.Input.Keyboard.Key;
    right: Phaser.Input.Keyboard.Key;
  };
  private jumpHoldFrames = 0;
  private jumpWasHeld = false;
  private coyoteFrames = 0;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    this.sprite = scene.physics.add.sprite(x, y, 'player');
    this.sprite.setBounce(0.1);
    this.sprite.setCollideWorldBounds(true);
    this.sprite.setDragX(PLAYER_DRAG_X);

    this.cursors = scene.input.keyboard!.createCursorKeys();
    this.wasd = {
      up: scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      left: scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      right: scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.D),
    };
  }

  get gameObject(): Phaser.Physics.Arcade.Sprite {
    return this.sprite;
  }

  update(): void {
    const body = this.sprite.body as Phaser.Physics.Arcade.Body;
    const onGround = body.blocked.down;

    const hadCoyote = this.coyoteFrames > 0;
    if (onGround) {
      this.coyoteFrames = COYOTE_FRAMES;
    } else if (this.coyoteFrames > 0) {
      this.coyoteFrames--;
    }

    const movingLeft = this.cursors.left.isDown || this.wasd.left.isDown;
    const movingRight = this.cursors.right.isDown || this.wasd.right.isDown;
    const jumpPressed =
      this.cursors.up.isDown || this.cursors.space.isDown || this.wasd.up.isDown;

    if (movingLeft) {
      this.sprite.setVelocityX(-PLAYER_SPEED);
      this.sprite.setFlipX(true);
    } else if (movingRight) {
      this.sprite.setVelocityX(PLAYER_SPEED);
      this.sprite.setFlipX(false);
    }

    const canJump = onGround || hadCoyote;

    if (jumpPressed) {
      if (!this.jumpWasHeld && canJump) {
        this.sprite.setVelocityY(PLAYER_JUMP_VELOCITY);
        this.jumpHoldFrames = 1;
        this.coyoteFrames = 0;
      } else if (!onGround && this.jumpHoldFrames > 0 && this.jumpHoldFrames < PLAYER_JUMP_HOLD_FRAMES) {
        this.sprite.setVelocityY(PLAYER_JUMP_VELOCITY + this.jumpHoldFrames * PLAYER_JUMP_HOLD);
        this.jumpHoldFrames++;
      } else if (this.jumpHoldFrames >= PLAYER_JUMP_HOLD_FRAMES) {
        this.jumpHoldFrames = 0;
      }
      this.jumpWasHeld = true;
    } else {
      this.jumpWasHeld = false;
      this.jumpHoldFrames = 0;
    }
  }
}
