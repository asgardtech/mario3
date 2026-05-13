export interface Platform {
  x: number;
  y: number;
  tileCount: number;
}

export interface Coin {
  x: number;
  y: number;
}

export interface EnemySpawn {
  x: number;
  y: number;
  patrolDistance: number;
}

export interface LevelData {
  playerSpawn: { x: number; y: number };
  platforms: Platform[];
  coins: Coin[];
  enemies: EnemySpawn[];
}
