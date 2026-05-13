import Phaser from 'phaser';
import { LEVEL_WIDTH, PLAYER_LIVES } from './constants';

export class HUDScene extends Phaser.Scene {
  private scoreText!: Phaser.GameObjects.Text;
  private livesText!: Phaser.GameObjects.Text;
  private coinText!: Phaser.GameObjects.Text;

  constructor() {
    super({ key: 'HUDScene' });
  }

  create() {
    const score: number = this.registry.get('score') ?? 0;
    const lives: number = this.registry.get('lives') ?? PLAYER_LIVES;
    const coins: number = this.registry.get('coins') ?? 0;
    const totalCoins: number = this.registry.get('totalCoins') ?? 0;

    this.scoreText = this.add.text(16, 16, `SCORE: ${score}`, {
      fontSize: '20px',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 4,
    });

    this.coinText = this.add
      .text(LEVEL_WIDTH / 2, 16, `COINS: ${coins}/${totalCoins}`, {
        fontSize: '20px',
        color: '#ffd700',
        stroke: '#000000',
        strokeThickness: 4,
      })
      .setOrigin(0.5, 0);

    this.livesText = this.add
      .text(LEVEL_WIDTH - 16, 16, this.livesString(lives), {
        fontSize: '22px',
        color: '#ff6666',
        stroke: '#000000',
        strokeThickness: 4,
      })
      .setOrigin(1, 0);

    this.add.text(16, 42, 'Arrow keys / WASD: move & jump', {
      fontSize: '13px',
      color: '#cccccc',
      stroke: '#000000',
      strokeThickness: 3,
    });

    const onScoreChange = (_: unknown, value: number) => {
      this.scoreText.setText(`SCORE: ${value}`);
    };
    const onLivesChange = (_: unknown, value: number) => {
      this.livesText.setText(this.livesString(value));
    };
    const onCoinsChange = (_: unknown, value: number) => {
      const total: number = this.registry.get('totalCoins') ?? 0;
      this.coinText.setText(`COINS: ${value}/${total}`);
    };

    this.registry.events.on('changedata-score', onScoreChange);
    this.registry.events.on('changedata-lives', onLivesChange);
    this.registry.events.on('changedata-coins', onCoinsChange);

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.registry.events.off('changedata-score', onScoreChange);
      this.registry.events.off('changedata-lives', onLivesChange);
      this.registry.events.off('changedata-coins', onCoinsChange);
    });
  }

  private livesString(lives: number): string {
    return lives > 0 ? Array(lives).fill('♥').join(' ') : '';
  }
}
