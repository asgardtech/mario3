import Phaser from 'phaser';
import { Player } from './Player';
import { Enemy } from './Enemy';
import { TILE_SIZE, LEVEL_WIDTH, LEVEL_HEIGHT, GROUND_Y, ENEMY_STOMP_BOUNCE } from './constants';
import { LEVEL1 } from './levels/level1';

export class MainScene extends Phaser.Scene {
  private player!: Player;
  private platforms!: Phaser.Physics.Arcade.StaticGroup;
  private coins!: Phaser.Physics.Arcade.StaticGroup;
  private enemies: Enemy[] = [];
  private enemyGroup!: Phaser.Physics.Arcade.Group;
  private scoreText!: Phaser.GameObjects.Text;
  private score = 0;

  constructor() {
    super({ key: 'MainScene' });
  }

  create() {
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

    g.clear();
    g.fillStyle(0xff4444);
    g.fillRect(0, 0, 28, 28);
    g.generateTexture('enemy', 28, 28);

    g.destroy();

    this.add.rectangle(LEVEL_WIDTH / 2, LEVEL_HEIGHT / 2, LEVEL_WIDTH, LEVEL_HEIGHT, 0x87ceeb);

    this.platforms = this.physics.add.staticGroup();

    for (let x = TILE_SIZE / 2; x < LEVEL_WIDTH; x += TILE_SIZE) {
      this.platforms.create(x, GROUND_Y, 'ground');
    }

    for (const { x: xStart, y, tileCount } of LEVEL1.platforms) {
      for (let i = 0; i < tileCount; i++) {
        this.platforms.create(xStart + i * TILE_SIZE, y, 'platform');
      }
    }

    this.coins = this.physics.add.staticGroup();
    for (const { x, y } of LEVEL1.coins) {
      this.coins.create(x, y, 'coin');
    }

    this.enemyGroup = this.physics.add.group();
    for (const { x, y, patrolDistance } of LEVEL1.enemies) {
      const enemy = new Enemy(this, x, y, patrolDistance);
      this.enemies.push(enemy);
      this.enemyGroup.add(enemy.gameObject);
    }

    this.player = new Player(this, LEVEL1.playerSpawn.x, LEVEL1.playerSpawn.y);

    this.physics.add.collider(this.player.gameObject, this.platforms);
    this.physics.add.collider(this.enemyGroup, this.platforms);

    this.physics.add.overlap(
      this.player.gameObject,
      this.enemyGroup,
      (playerObj, enemyObj) => {
        const playerSprite = playerObj as Phaser.Physics.Arcade.Sprite;
        const playerBody = playerSprite.body as Phaser.Physics.Arcade.Body;
        const enemySprite = enemyObj as Phaser.Physics.Arcade.Sprite;

        if (playerBody.velocity.y > 0) {
          const enemy = this.enemies.find(e => e.gameObject === enemySprite);
          if (enemy) {
            enemy.stomp();
            this.score += 100;
            this.scoreText.setText(`Score: ${this.score}`);
            playerSprite.setVelocityY(ENEMY_STOMP_BOUNCE);
          }
        }
      },
    );

    this.physics.add.overlap(
      this.player.gameObject,
      this.coins,
      (_player, coin) => {
        (coin as Phaser.Physics.Arcade.Image).destroy();
        this.score += 10;
        this.scoreText.setText(`Score: ${this.score}`);
      },
    );

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
    for (const enemy of this.enemies) {
      enemy.update();
    }
  }
}
