import Phaser from 'phaser';
import { ENEMY_SPEED } from './constants';

export class Enemy {
  private sprite: Phaser.Physics.Arcade.Sprite;
  private startX: number;
  private patrolDistance: number;
  private direction = 1;

  constructor(scene: Phaser.Scene, x: number, y: number, patrolDistance: number) {
    this.sprite = scene.physics.add.sprite(x, y, 'enemy');
    this.sprite.setCollideWorldBounds(true);
    this.startX = x;
    this.patrolDistance = patrolDistance;
  }

  get gameObject(): Phaser.Physics.Arcade.Sprite {
    return this.sprite;
  }

  update(): void {
    if (!this.sprite.active) return;

    const { x } = this.sprite;

    if (this.direction > 0 && x >= this.startX + this.patrolDistance) {
      this.direction = -1;
    } else if (this.direction < 0 && x <= this.startX) {
      this.direction = 1;
    }

    this.sprite.setVelocityX(ENEMY_SPEED * this.direction);
    this.sprite.setFlipX(this.direction < 0);
  }

  stomp(): void {
    this.sprite.destroy();
  }
}
