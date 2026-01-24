import { createZodDto } from 'nestjs-zod';
import {
  CreateLocationRequestSchema,
  GetAllLocationsQuerySchema,
  GetLocationByIdParamsSchema,
  DeleteLocationParamsSchema,
} from 'node-api-contracts';

export class CreateLocationDto extends createZodDto(
  CreateLocationRequestSchema,
) {}
export class GetAllLocationsQueryDto extends createZodDto(
  GetAllLocationsQuerySchema,
) {}

export class LocationIdParamDto extends createZodDto(
  GetLocationByIdParamsSchema,
) {}
export class DeleteLocationParamDto extends createZodDto(
  DeleteLocationParamsSchema,
) {}
