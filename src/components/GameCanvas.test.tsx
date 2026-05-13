import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';

const mockDestroy = vi.fn();

vi.mock('phaser', () => ({
  default: {
    AUTO: 1,
    Game: vi.fn().mockImplementation(() => ({ destroy: mockDestroy })),
    Scene: class {},
  },
}));

vi.mock('@/game/MainScene', () => ({
  MainScene: class {},
}));

import Phaser from 'phaser';
import { GameCanvas } from './GameCanvas';

let container: HTMLDivElement;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
  mockDestroy.mockClear();
  vi.mocked(Phaser.Game).mockClear();
});

afterEach(() => {
  if (container.parentNode) {
    act(() => { unmountComponentAtNode(container); });
    container.remove();
  }
});

function mount() {
  act(() => { render(<GameCanvas />, container); });
}

function unmount() {
  act(() => { unmountComponentAtNode(container); });
}

describe('GameCanvas', () => {
  it('renders a container div as Phaser mount target', () => {
    mount();
    expect(container.querySelector('div')).toBeInTheDocument();
  });

  it('container div has id="phaser-container" [AC1 - REQUIRED]', () => {
    mount();
    expect(document.getElementById('phaser-container')).toBeInTheDocument();
  });

  it('container div has 800x600 dimensions', () => {
    mount();
    const div = document.getElementById('phaser-container');
    expect(div).toHaveStyle({ width: '800px', height: '600px' });
  });

  it('creates a Phaser.Game instance on mount', () => {
    mount();
    expect(Phaser.Game).toHaveBeenCalledTimes(1);
  });

  it('passes width=800 and height=600 to Phaser.Game config', () => {
    mount();
    const config = vi.mocked(Phaser.Game).mock.calls[0][0] as Phaser.Types.Core.GameConfig;
    expect(config.width).toBe(800);
    expect(config.height).toBe(600);
  });

  it('configures arcade physics with y-gravity of 500', () => {
    mount();
    const config = vi.mocked(Phaser.Game).mock.calls[0][0] as Phaser.Types.Core.GameConfig;
    expect((config.physics as { default: string; arcade: { gravity: { y: number } } }).default).toBe('arcade');
    expect((config.physics as { default: string; arcade: { gravity: { y: number } } }).arcade.gravity.y).toBe(500);
  });

  it('includes MainScene in the Phaser scene list', () => {
    mount();
    const config = vi.mocked(Phaser.Game).mock.calls[0][0] as Phaser.Types.Core.GameConfig;
    expect((config.scene as unknown[]).length).toBe(1);
  });

  it('passes the container div as the Phaser parent element', () => {
    mount();
    const config = vi.mocked(Phaser.Game).mock.calls[0][0] as Phaser.Types.Core.GameConfig;
    expect(config.parent).toBeInstanceOf(HTMLDivElement);
    expect((config.parent as HTMLDivElement).id).toBe('phaser-container');
  });

  it('calls game.destroy(true) when the component unmounts', () => {
    mount();
    unmount();
    expect(mockDestroy).toHaveBeenCalledWith(true);
  });

  it('calls destroy exactly once when unmounted', () => {
    mount();
    unmount();
    expect(mockDestroy).toHaveBeenCalledTimes(1);
  });

  it('allows a new Phaser instance after the previous one was destroyed (re-mount)', () => {
    mount();
    unmount();
    mount();
    expect(Phaser.Game).toHaveBeenCalledTimes(2);
  });

  it('keeps exactly one Phaser instance alive under React Strict Mode double-invocation', () => {
    mount();
    unmount();
    mount();
    const created = vi.mocked(Phaser.Game).mock.calls.length;
    const destroyed = mockDestroy.mock.calls.length;
    expect(created - destroyed).toBe(1);
  });

  it('calls destroy at least once during Strict Mode cleanup before remount', () => {
    mount();
    unmount();
    expect(mockDestroy).toHaveBeenCalledTimes(1);
    mount();
  });

  it('never has more than one Phaser instance alive simultaneously (Strict Mode)', () => {
    mount();
    unmount();
    mount();
    const created = vi.mocked(Phaser.Game).mock.calls.length;
    const destroyed = mockDestroy.mock.calls.length;
    expect(created - destroyed).toBeLessThanOrEqual(1);
  });
});
