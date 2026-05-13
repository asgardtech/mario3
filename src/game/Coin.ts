import Phaser from 'phaser';

export class Coin {
  private image: Phaser.Physics.Arcade.Image;
  private _collected = false;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    this.image = scene.physics.add.staticImage(x, y, 'coin');
  }

  get gameObject(): Phaser.Physics.Arcade.Image {
    return this.image;
  }

  get collected(): boolean {
    return this._collected;
  }

  collect(): boolean {
    if (this._collected) return false;
    this._collected = true;
    this.image.destroy();
    return true;
  }
}
