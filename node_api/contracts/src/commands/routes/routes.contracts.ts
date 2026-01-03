import { z } from 'zod';
import { ApiResponseSchema, ObjectIdSchema } from '../_shared';
import { OPTIMIZATION_MODES, ROUTE_ANCHORS } from '../../shared/route';
import { ApiPaginatedResponseSchema, PaginationQuerySchema } from '../_shared';

export const RoutesControllerMap = {
  name: 'routes',
  CREATE: '',
  GET_ALL: '',
  GET_BY_ID: ':id',
  UPDATE: ':id',
  DELETE: ':id',
  OPTIMIZE: ':id/optimize',
  GET_ANCHORS: 'anchors',
} as const;

// DTO
export const RouteDtoSchema = z.object({
  id: ObjectIdSchema,
  name: z.string(),
  locationsMap: z.array(ObjectIdSchema),
  stopsCount: z.number().nonnegative(),
  totalDistance: z.number().nonnegative(), // meters
  totalTime: z.number().nonnegative(), // seconds
  visitOrder: z.array(z.number().int().nonnegative()).default([]),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type RouteDto = z.infer<typeof RouteDtoSchema>;

// Create
export const CreateRouteRequestSchema = RouteDtoSchema.omit({
  id: true,
  totalDistance: true,
  totalTime: true,
  visitOrder: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  // MVP: totals можуть порахуватись беком
  totalDistance: z.number().nonnegative().optional(),
  totalTime: z.number().nonnegative().optional(),
});
export type CreateRouteRequest = z.infer<typeof CreateRouteRequestSchema>;

export const CreateRouteResponseSchema = ApiResponseSchema(RouteDtoSchema);
export type CreateRouteResponse = z.infer<typeof CreateRouteResponseSchema>;

// Get all
export const GetAllRoutesQuerySchema = PaginationQuerySchema;
export type GetAllRoutesQuery = z.infer<typeof GetAllRoutesQuerySchema>;

export const GetAllRoutesResponseSchema =
  ApiPaginatedResponseSchema(RouteDtoSchema);
export type GetAllRoutesResponse = z.infer<typeof GetAllRoutesResponseSchema>;

// Get by id
export const GetRouteByIdParamsSchema = z.object({ id: ObjectIdSchema });
export type GetRouteByIdParams = z.infer<typeof GetRouteByIdParamsSchema>;

export const GetRouteByIdResponseSchema = ApiResponseSchema(RouteDtoSchema);
export type GetRouteByIdResponse = z.infer<typeof GetRouteByIdResponseSchema>;

// Update
export const UpdateRouteParamsSchema = z.object({ id: ObjectIdSchema });
export type UpdateRouteParams = z.infer<typeof UpdateRouteParamsSchema>;

export const UpdateRouteRequestSchema = CreateRouteRequestSchema.partial();
export type UpdateRouteRequest = z.infer<typeof UpdateRouteRequestSchema>;

export const UpdateRouteResponseSchema = ApiResponseSchema(RouteDtoSchema);
export type UpdateRouteResponse = z.infer<typeof UpdateRouteResponseSchema>;

// Delete
export const DeleteRouteParamsSchema = z.object({ id: ObjectIdSchema });
export type DeleteRouteParams = z.infer<typeof DeleteRouteParamsSchema>;

export const DeleteRouteResponseSchema = ApiResponseSchema(
  z.object({ deleted: z.boolean() }),
);
export type DeleteRouteResponse = z.infer<typeof DeleteRouteResponseSchema>;

// Anchors
export const GetAnchorsResponseSchema = ApiResponseSchema(
  z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      coordinates: z.tuple([z.number(), z.number()]), // [lng, lat]
    }),
  ),
);
export type GetAnchorsResponse = z.infer<typeof GetAnchorsResponseSchema>;

// Optimize (мінімальний контракт, без бізнес-полів)
export const OptimizeRouteParamsSchema = z.object({ id: ObjectIdSchema });
export type OptimizeRouteParams = z.infer<typeof OptimizeRouteParamsSchema>;

export const OptimizeRouteRequestSchema = z.object({
  mode: z.enum(OPTIMIZATION_MODES),
  anchorId: z.string().optional(), // якщо треба стартова точка з ROUTE_ANCHORS
});
export type OptimizeRouteRequest = z.infer<typeof OptimizeRouteRequestSchema>;

export const OptimizeRouteResponseSchema = ApiResponseSchema(RouteDtoSchema);
export type OptimizeRouteResponse = z.infer<typeof OptimizeRouteResponseSchema>;

// Значення anchors для фронта (як константа)
export const ROUTE_ANCHORS_CONST = ROUTE_ANCHORS;
