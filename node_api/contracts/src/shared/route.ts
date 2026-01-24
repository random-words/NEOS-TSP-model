import type { LngLat } from './geo';
export const OPTIMIZATION_MODES = ['BUDGET', 'TIME', 'DISTANCE'] as const;
export type OptimizationMode = (typeof OPTIMIZATION_MODES)[number];

export const DISTANCE_UNIT = 'm' as const; // meters
export const TIME_UNIT = 's' as const; // seconds

export type RouteAnchor = {
  id: string;
  name: string;
  coordinates: LngLat; // [lng, lat]
};

export const ROUTE_ANCHORS = [
  { id: 'uzhhorod', name: 'Uzhhorod', coordinates: [22.2895, 48.6217] },
] as const satisfies readonly RouteAnchor[];
