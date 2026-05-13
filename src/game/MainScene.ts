import Phaser from 'phaser';
import { Player } from './Player';
import { Enemy } from './Enemy';
import { Coin } from './Coin';
import { ScoreManager } from './ScoreManager';
import {
  TILE_SIZE,
  LEVEL_WIDTH,
  LEVEL_HEIGHT,
  GROUND_Y,
  ENEMY_STOMP_BOUNCE,
  INVINCIBILITY_DURATION,
} from './constants';
import { LEVEL1 } from './levels/level1';

export class MainScene extends Phaser.Scene {
  private player!: Player;
  private platforms!: Phaser.Physics.Arcade.StaticGroup;
  private coinGroup!: Phaser.Physics.Arcade.StaticGroup;
  private coinMap = new Map<Phaser.GameObjects.GameObject, Coin>();
  private enemies: Enemy[] = [];
  private enemyGroup!: Phaser.Physics.Arcade.Group;
  private scoreManager!: ScoreManager;
  private coinsCollected = 0;
  private totalCoins = 0;
  private levelComplete = false;
  private isInvincible = false;
  private isDead = false;

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
    this.coinsCollected = 0;
    this.levelComplete = false;
    this.isInvincible = false;
    this.isDead = false;

    this.totalCoins = LEVEL1.coins.length;
    this.coinGroup = this.physics.add.staticGroup();
    this.coinMap = new Map();
    for (const { x, y } of LEVEL1.coins) {
      const coin = new Coin(this, x, y);
      this.coinMap.set(coin.gameObject, coin);
      this.coinGroup.add(coin.gameObject);
    }

    this.enemies = [];
    this.enemyGroup = this.physics.add.group();
    for (const { x, y, patrolDistance } of LEVEL1.enemies) {
      const enemy = new Enemy(this, x, y, patrolDistance);
      this.enemies.push(enemy);
      this.enemyGroup.add(enemy.gameObject);
    }

    this.player = new Player(this, LEVEL1.playerSpawn.x, LEVEL1.playerSpawn.y);

    this.registry.set('score', 0);
    this.registry.set('lives', this.scoreManager.lives);
    this.registry.set('coins', 0);
    this.registry.set('totalCoins', this.totalCoins);

    this.physics.add.collider(this.player.gameObject, this.platforms);
    this.physics.add.collider(this.enemyGroup, this.platforms);

    this.physics.add.overlap(
      this.player.gameObject,
      this.enemyGroup,
      (playerObj, enemyObj) => {
        if (this.isInvincible || this.levelComplete) return;

        const playerSprite = playerObj as Phaser.Physics.Arcade.Sprite;
        const playerBody = playerSprite.body as Phaser.Physics.Arcade.Body;
        const enemySprite = enemyObj as Phaser.Physics.Arcade.Sprite;

        if (playerBody.velocity.y > 0) {
          const enemy = this.enemies.find(e => e.gameObject === enemySprite);
          if (enemy) {
            enemy.stomp();
            this.registry.set('score', this.scoreManager.addStomp());
            playerSprite.setVelocityY(ENEMY_STOMP_BOUNCE);
          }
        } else {
          this.loseLife();
        }
      },
    );

    this.physics.add.overlap(
      this.player.gameObject,
      this.coinGroup,
      (_player, coinObj) => {
        if (this.levelComplete) return;
        const coin = this.coinMap.get(coinObj as Phaser.GameObjects.GameObject);
        if (coin && coin.collect()) {
          this.coinMap.delete(coinObj as Phaser.GameObjects.GameObject);
          this.coinsCollected++;
          this.registry.set('score', this.scoreManager.addCoin());
          this.registry.set('coins', this.coinsCollected);
          if (this.coinsCollected === this.totalCoins) {
            this.completeLevel();
          }
        }
      },
    );

    this.scene.launch('HUDScene');
  }

  private loseLife(): void {
    this.scoreManager.loseLife();
    this.isInvincible = true;
    this.registry.set('lives', this.scoreManager.lives);

    if (!this.scoreManager.hasLives()) {
      this.isDead = true;
      this.physics.pause();
      this.scene.launch('GameOverScene', {
        score: this.scoreManager.score,
        coins: this.coinsCollected,
        totalCoins: this.totalCoins,
      });
      return;
    }

    const body = this.player.gameObject.body as Phaser.Physics.Arcade.Body;
    body.reset(LEVEL1.playerSpawn.x, LEVEL1.playerSpawn.y);

    const flashCount = Math.floor(INVINCIBILITY_DURATION / 300);
    const flashStep = Math.round(INVINCIBILITY_DURATION / (flashCount * 2));
    this.tweens.add({
      targets: this.player.gameObject,
      alpha: 0,
      duration: flashStep,
      ease: 'Linear',
      repeat: flashCount - 1,
      yoyo: true,
      onComplete: () => {
        this.player.gameObject.setAlpha(1);
        this.isInvincible = false;
      },
    });
  }

  private completeLevel(): void {
    this.levelComplete = true;
    this.physics.pause();
    this.scene.launch('LevelCompleteScene', {
      score: this.scoreManager.score,
      coins: this.coinsCollected,
      totalCoins: this.totalCoins,
    });
  }

  update() {
    if (this.levelComplete || this.isDead) return;
    this.player.update();
    for (const enemy of this.enemies) {
      enemy.update();
    }
    if (!this.isInvincible && this.player.gameObject.y > LEVEL_HEIGHT + 64) {
      this.loseLife();
    }
  }
}
