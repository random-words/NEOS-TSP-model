import { z } from 'zod';

export type LngLat = readonly [lng: number, lat: number];

export type GeoPoint = {
  type: 'Point';
  coordinates: LngLat;
};

export const GeoPointSchema = z.object({
  type: z.literal('Point'),
  coordinates: z.tuple([z.number(), z.number()]), // [lng, lat]
});
