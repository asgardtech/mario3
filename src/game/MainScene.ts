import Phaser from 'phaser';
import { Player } from './Player';
import { LEVEL_WIDTH, LEVEL_HEIGHT, GROUND_Y } from './constants';

// [xStart, xEnd, y] — tiles fill from xStart up to (but not including) xEnd, step 32
export const PLATFORM_LAYOUT: Array<[number, number, number]> = [
  // Section 1: easy opening
  [192, 384, 448],
  [512, 672, 352],
  // Section 2: rising staircase
  [832, 1024, 416],
  [1088, 1280, 320],
  [1344, 1472, 448],
  // Section 3: high-low variation
  [1600, 1760, 352],
  [1856, 2016, 256],
  [2080, 2240, 384],
  // Section 4: final approach
  [2368, 2528, 320],
  [2624, 2784, 416],
  [2880, 3040, 288],
  [3104, 3168, 448],
];

// [x, y] coin positions — above the midpoint of each platform
export const COIN_POSITIONS: Array<[number, number]> = [
  [240, 416], [288, 416], [336, 416],
  [560, 320], [608, 320], [656, 320],
  [880, 384], [928, 384], [976, 384],
  [1136, 288], [1184, 288], [1232, 288],
  [1392, 416], [1440, 416],
  [1648, 320], [1696, 320],
  [1904, 224], [1952, 224], [2000, 224],
  [2128, 352], [2176, 352],
  [2416, 288], [2464, 288], [2512, 288],
  [2672, 384], [2720, 384],
  [2928, 256], [2976, 256], [3024, 256],
  [3120, 416],
];

export class MainScene extends Phaser.Scene {
  private player!: Player;
  private platforms!: Phaser.Physics.Arcade.StaticGroup;
  private coins!: Phaser.Physics.Arcade.StaticGroup;
  private scoreText!: Phaser.GameObjects.Text;
  private score = 0;

  constructor() {
    super({ key: 'MainScene' });
  }

  create() {
    this.physics.world.setBounds(0, 0, LEVEL_WIDTH, LEVEL_HEIGHT);

    const g = this.make.graphics({ x: 0, y: 0, add: false });

    g.fillStyle(0x4169e1);
    g.fillRect(0, 0, 32, 48);
    g.generateTexture('player', 32, 48);

    g.clear();
    g.fillStyle(0x8b4513);
    g.fillRect(0, 0, 32, 32);
    g.generateTexture('ground', 32, 32);

    g.clear();
    g.fillStyle(0x228b22);
    g.fillRect(0, 0, 32, 20);
    g.generateTexture('platform', 32, 20);

    g.clear();
    g.fillStyle(0xffd700);
    g.fillCircle(12, 12, 12);
    g.generateTexture('coin', 24, 24);

    g.destroy();

    this.add.rectangle(LEVEL_WIDTH / 2, LEVEL_HEIGHT / 2, LEVEL_WIDTH, LEVEL_HEIGHT, 0x87ceeb);

    this.platforms = this.physics.add.staticGroup();

    for (let x = 16; x < LEVEL_WIDTH; x += 32) {
      this.platforms.create(x, GROUND_Y, 'ground');
    }

    for (const [xStart, xEnd, y] of PLATFORM_LAYOUT) {
      for (let x = xStart; x < xEnd; x += 32) {
        this.platforms.create(x, y, 'platform');
      }
    }

    this.coins = this.physics.add.staticGroup();
    for (const [x, y] of COIN_POSITIONS) {
      this.coins.create(x, y, 'coin');
    }

    this.player = new Player(this, 80, 500);

    this.physics.add.collider(this.player.gameObject, this.platforms);
    this.physics.add.overlap(
      this.player.gameObject,
      this.coins,
      (_player, coin) => {
        (coin as Phaser.Physics.Arcade.Image).destroy();
        this.score += 10;
        this.scoreText.setText(`Score: ${this.score}`);
      },
    );

    this.cameras.main.setBounds(0, 0, LEVEL_WIDTH, LEVEL_HEIGHT);
    this.cameras.main.startFollow(this.player.gameObject, true, 0.1, 0.1);

    this.scoreText = this.add
      .text(16, 16, 'Score: 0', {
        fontSize: '20px',
        color: '#ffffff',
        stroke: '#000000',
        strokeThickness: 4,
      })
      .setScrollFactor(0);

    this.add
      .text(16, 44, 'Arrow keys / WASD: move / jump', {
        fontSize: '13px',
        color: '#ffffff',
        stroke: '#000000',
        strokeThickness: 3,
      })
      .setScrollFactor(0);
  }

  update() {
    this.player.update();
  }
}
