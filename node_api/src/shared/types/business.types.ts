export type LocationType =
  | 'restaurant'
  | 'store'
  | 'warehouse'
  | 'winery'
  | 'vineyard'
  | 'other';

export enum WINE_TYPES {
  ALL = 'ALL',
  ORANGE = 'ORANGE',
  WHITE = 'WHITE',
  NATURAL = 'NATURAL',
  ROSE = 'ROSE',
  MIX = 'MIX',
  SPARKLING = 'SPARKLING',
  RED = 'RED',
}

export enum OPTIMIZATION_MODES {
  BUDGET = 'BUDGET',
  TIME = 'TIME',
  DISTANCE = 'DISTANCE',
}
