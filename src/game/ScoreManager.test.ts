import { describe, it, expect, beforeEach } from 'vitest';
import { ScoreManager, COIN_SCORE, STOMP_SCORE } from './ScoreManager';

describe('ScoreManager', () => {
  let manager: ScoreManager;

  beforeEach(() => {
    manager = new ScoreManager();
  });

  it('starts at zero', () => {
    expect(manager.score).toBe(0);
  });

  describe('addCoin', () => {
    it('increases score by COIN_SCORE', () => {
      manager.addCoin();
      expect(manager.score).toBe(COIN_SCORE);
    });

    it('returns the new score after adding a coin', () => {
      const result = manager.addCoin();
      expect(result).toBe(COIN_SCORE);
    });

    it('accumulates score across multiple coin collections', () => {
      manager.addCoin();
      manager.addCoin();
      manager.addCoin();
      expect(manager.score).toBe(COIN_SCORE * 3);
    });

    it('COIN_SCORE is 10', () => {
      expect(COIN_SCORE).toBe(10);
    });
  });

  describe('addStomp', () => {
    it('increases score by STOMP_SCORE', () => {
      manager.addStomp();
      expect(manager.score).toBe(STOMP_SCORE);
    });

    it('returns the new score after a stomp', () => {
      const result = manager.addStomp();
      expect(result).toBe(STOMP_SCORE);
    });

    it('accumulates score across multiple stomps', () => {
      manager.addStomp();
      manager.addStomp();
      expect(manager.score).toBe(STOMP_SCORE * 2);
    });

    it('STOMP_SCORE is 100', () => {
      expect(STOMP_SCORE).toBe(100);
    });
  });

  describe('mixed scoring', () => {
    it('correctly accumulates coins and stomps together', () => {
      manager.addCoin();
      manager.addStomp();
      manager.addCoin();
      expect(manager.score).toBe(COIN_SCORE + STOMP_SCORE + COIN_SCORE);
    });

    it('returns running total after each event', () => {
      expect(manager.addCoin()).toBe(COIN_SCORE);
      expect(manager.addStomp()).toBe(COIN_SCORE + STOMP_SCORE);
      expect(manager.addCoin()).toBe(COIN_SCORE * 2 + STOMP_SCORE);
    });
  });

  describe('reset', () => {
    it('resets score to zero', () => {
      manager.addCoin();
      manager.addStomp();
      manager.reset();
      expect(manager.score).toBe(0);
    });

    it('allows accumulation after reset', () => {
      manager.addCoin();
      manager.reset();
      manager.addCoin();
      expect(manager.score).toBe(COIN_SCORE);
    });
  });
});
