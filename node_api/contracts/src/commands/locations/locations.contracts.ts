import { z } from 'zod';
import { ApiResponseSchema, ObjectIdSchema } from '../_shared';
import { GeoPointSchema } from '../../shared/geo';
import { WINE_TYPES } from '../../shared/wine';
import { ApiPaginatedResponseSchema, PaginationQuerySchema } from '../_shared';

export const LocationsControllerMap = {
  name: 'locations',
  CREATE: '',
  GET_ALL: '',
  GET_BY_ID: ':id',
  UPDATE: ':id',
  DELETE: ':id',
} as const;

// DTO
export const LocationDtoSchema = z.object({
  id: ObjectIdSchema,
  name: z.string(),
  description: z.string(),
  location: GeoPointSchema,
  address: z.string(),
  priceLevel: z.number().nonnegative(),
  imagesLinks: z.array(z.string()).default([]),
  avgStayMinutes: z.number().nonnegative(),
  avgTastingPricePerPerson: z.number().nonnegative(),
  avgMealPricePerPerson: z.number().nonnegative(),
  avgBottlePrice: z.number().nonnegative(),
  siteUrl: z.string(),
  contactNumber: z.string(),
  wineTags: z.array(z.enum(WINE_TYPES)).default([]),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type LocationDto = z.infer<typeof LocationDtoSchema>;

// Create
export const CreateLocationRequestSchema = LocationDtoSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type CreateLocationRequest = z.infer<typeof CreateLocationRequestSchema>;

export const CreateLocationResponseSchema =
  ApiResponseSchema(LocationDtoSchema);
export type CreateLocationResponse = z.infer<
  typeof CreateLocationResponseSchema
>;

// Get all
// Query (для ?page=&limit=)
export const GetAllLocationsQuerySchema = PaginationQuerySchema;
export type GetAllLocationsQuery = z.infer<typeof GetAllLocationsQuerySchema>;

// Response
export const GetAllLocationsResponseSchema =
  ApiPaginatedResponseSchema(LocationDtoSchema);
export type GetAllLocationsResponse = z.infer<
  typeof GetAllLocationsResponseSchema
>;

// Get by id
export const GetLocationByIdParamsSchema = z.object({ id: ObjectIdSchema });
export type GetLocationByIdParams = z.infer<typeof GetLocationByIdParamsSchema>;

export const GetLocationByIdResponseSchema =
  ApiResponseSchema(LocationDtoSchema);
export type GetLocationByIdResponse = z.infer<
  typeof GetLocationByIdResponseSchema
>;

// Update
export const UpdateLocationParamsSchema = z.object({ id: ObjectIdSchema });
export type UpdateLocationParams = z.infer<typeof UpdateLocationParamsSchema>;

// MVP: PATCH-подібне оновлення
export const UpdateLocationRequestSchema =
  CreateLocationRequestSchema.partial();
export type UpdateLocationRequest = z.infer<typeof UpdateLocationRequestSchema>;

export const UpdateLocationResponseSchema =
  ApiResponseSchema(LocationDtoSchema);
export type UpdateLocationResponse = z.infer<
  typeof UpdateLocationResponseSchema
>;

// Delete
export const DeleteLocationParamsSchema = z.object({ id: ObjectIdSchema });
export type DeleteLocationParams = z.infer<typeof DeleteLocationParamsSchema>;

export const DeleteLocationResponseSchema = ApiResponseSchema(
  z.object({ deleted: z.boolean() }),
);
export type DeleteLocationResponse = z.infer<
  typeof DeleteLocationResponseSchema
>;
