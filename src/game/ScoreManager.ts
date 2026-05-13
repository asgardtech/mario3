import { PLAYER_LIVES } from './constants';

export const COIN_SCORE = 10;
export const STOMP_SCORE = 100;

export class ScoreManager {
  private _score = 0;
  private _lives = PLAYER_LIVES;

  get score(): number {
    return this._score;
  }

  get lives(): number {
    return this._lives;
  }

  addCoin(): number {
    this._score += COIN_SCORE;
    return this._score;
  }

  addStomp(): number {
    this._score += STOMP_SCORE;
    return this._score;
  }

  loseLife(): void {
    this._lives--;
  }

  hasLives(): boolean {
    return this._lives > 0;
  }

  reset(): void {
    this._score = 0;
    this._lives = PLAYER_LIVES;
  }
}
