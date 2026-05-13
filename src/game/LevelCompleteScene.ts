import Phaser from 'phaser';
import { LEVEL_WIDTH, LEVEL_HEIGHT } from './constants';

interface LevelCompleteData {
  score: number;
  coins: number;
  totalCoins: number;
}

export class LevelCompleteScene extends Phaser.Scene {
  constructor() {
    super({ key: 'LevelCompleteScene' });
  }

  create(data: LevelCompleteData) {
    this.add.rectangle(LEVEL_WIDTH / 2, LEVEL_HEIGHT / 2, LEVEL_WIDTH, LEVEL_HEIGHT, 0x000033, 0.75);

    this.add
      .text(LEVEL_WIDTH / 2, LEVEL_HEIGHT / 2 - 100, 'LEVEL COMPLETE!', {
        fontSize: '52px',
        color: '#ffd700',
        stroke: '#000000',
        strokeThickness: 8,
      })
      .setOrigin(0.5);

    this.add
      .text(LEVEL_WIDTH / 2, LEVEL_HEIGHT / 2 - 16, `Score: ${data.score}`, {
        fontSize: '32px',
        color: '#ffffff',
        stroke: '#000000',
        strokeThickness: 4,
      })
      .setOrigin(0.5);

    this.add
      .text(LEVEL_WIDTH / 2, LEVEL_HEIGHT / 2 + 32, `Coins: ${data.coins} / ${data.totalCoins}`, {
        fontSize: '24px',
        color: '#ffd700',
        stroke: '#000000',
        strokeThickness: 4,
      })
      .setOrigin(0.5);

    this.add
      .text(LEVEL_WIDTH / 2, LEVEL_HEIGHT / 2 + 96, 'Press R to play again', {
        fontSize: '24px',
        color: '#aaffaa',
        stroke: '#000000',
        strokeThickness: 4,
      })
      .setOrigin(0.5);

    this.input.keyboard?.once('keydown-R', () => {
      this.scene.stop('HUDScene');
      this.scene.stop(this.scene.key);
      this.scene.start('MainScene');
    });
  }
}
