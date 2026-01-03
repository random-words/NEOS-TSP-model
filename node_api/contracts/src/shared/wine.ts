export const WINE_TYPES = [
  'ORANGE',
  'WHITE',
  'NATURAL',
  'ROSE',
  'MIX',
  'SPARKLING',
  'RED',
] as const;

export type WineType = (typeof WINE_TYPES)[number];

export const WINE_FILTERS = ['ALL', ...WINE_TYPES] as const;
export type WineFilter = (typeof WINE_FILTERS)[number];
