import { createZodDto } from 'nestjs-zod';
import {
  CreateLocationRequestSchema,
  UpdateLocationRequestSchema,
  GetAllLocationsQuerySchema,
  GetLocationByIdParamsSchema,
} from 'node-api-contracts';

export class CreateLocationDto extends createZodDto(
  CreateLocationRequestSchema,
) {}
export class UpdateLocationDto extends createZodDto(
  UpdateLocationRequestSchema,
) {}
export class GetAllLocationsQueryDto extends createZodDto(
  GetAllLocationsQuerySchema,
) {}
export class IdParamDto extends createZodDto(GetLocationByIdParamsSchema) {}
