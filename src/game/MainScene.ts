import Phaser from 'phaser';
import { Player } from './Player';
import { Enemy } from './Enemy';
import { Coin } from './Coin';
import { ScoreManager } from './ScoreManager';
import { TILE_SIZE, LEVEL_WIDTH, LEVEL_HEIGHT, GROUND_Y, ENEMY_STOMP_BOUNCE } from './constants';
import { LEVEL1 } from './levels/level1';

export class MainScene extends Phaser.Scene {
  private player!: Player;
  private platforms!: Phaser.Physics.Arcade.StaticGroup;
  private coinGroup!: Phaser.Physics.Arcade.StaticGroup;
  private coinMap = new Map<Phaser.GameObjects.GameObject, Coin>();
  private enemies: Enemy[] = [];
  private enemyGroup!: Phaser.Physics.Arcade.Group;
  private scoreText!: Phaser.GameObjects.Text;
  private coinText!: Phaser.GameObjects.Text;
  private scoreManager!: ScoreManager;
  private coinsCollected = 0;
  private totalCoins = 0;
  private levelComplete = false;

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

    this.scoreManager = new ScoreManager();

    this.totalCoins = LEVEL1.coins.length;
    this.coinGroup = this.physics.add.staticGroup();
    for (const { x, y } of LEVEL1.coins) {
      const coin = new Coin(this, x, y);
      this.coinMap.set(coin.gameObject, coin);
      this.coinGroup.add(coin.gameObject);
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
            this.scoreText.setText(`Score: ${this.scoreManager.addStomp()}`);
            playerSprite.setVelocityY(ENEMY_STOMP_BOUNCE);
          }
        }
      },
    );

    this.physics.add.overlap(
      this.player.gameObject,
      this.coinGroup,
      (_player, coinObj) => {
        const coin = this.coinMap.get(coinObj as Phaser.GameObjects.GameObject);
        if (coin && coin.collect()) {
          this.coinMap.delete(coinObj as Phaser.GameObjects.GameObject);
          this.scoreText.setText(`Score: ${this.scoreManager.addCoin()}`);
          this.coinsCollected++;
          this.coinText.setText(`Coins: ${this.coinsCollected}/${this.totalCoins}`);
          if (this.coinsCollected === this.totalCoins) {
            this.levelComplete = true;
            this.physics.pause();
            this.add
              .text(LEVEL_WIDTH / 2, LEVEL_HEIGHT / 2, 'Level Complete!', {
                fontSize: '48px',
                color: '#ffffff',
                stroke: '#000000',
                strokeThickness: 6,
              })
              .setOrigin(0.5)
              .setScrollFactor(0);
          }
        }
      },
    );

    this.scoreText = this.add
      .text(16, 16, `Score: ${this.scoreManager.score}`, {
        fontSize: '20px',
        color: '#ffffff',
        stroke: '#000000',
        strokeThickness: 4,
      })
      .setScrollFactor(0);

    this.coinText = this.add
      .text(16, 40, `Coins: ${this.coinsCollected}/${this.totalCoins}`, {
        fontSize: '20px',
        color: '#ffffff',
        stroke: '#000000',
        strokeThickness: 4,
      })
      .setScrollFactor(0);

    this.add
      .text(16, 64, 'Arrow keys / WASD: move / jump', {
        fontSize: '13px',
        color: '#ffffff',
        stroke: '#000000',
        strokeThickness: 3,
      })
      .setScrollFactor(0);
  }

  update() {
    if (this.levelComplete) return;
    this.player.update();
    for (const enemy of this.enemies) {
      enemy.update();
    }
  }
}
