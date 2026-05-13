export const COIN_SCORE = 10;
export const STOMP_SCORE = 100;

export class ScoreManager {
  private _score = 0;

  get score(): number {
    return this._score;
  }

  addCoin(): number {
    this._score += COIN_SCORE;
    return this._score;
  }

  addStomp(): number {
    this._score += STOMP_SCORE;
    return this._score;
  }

  reset(): void {
    this._score = 0;
  }
}
