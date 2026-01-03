import { createZodDto } from 'nestjs-zod';
import {
  CreateRouteRequestSchema,
  UpdateRouteRequestSchema,
  GetAllRoutesQuerySchema,
  GetRouteByIdParamsSchema,
  UpdateRouteParamsSchema,
  DeleteRouteParamsSchema,
  OptimizeRouteParamsSchema,
  OptimizeRouteRequestSchema,
} from 'node-api-contracts';

// Body
export class CreateRouteDto extends createZodDto(CreateRouteRequestSchema) {}
export class UpdateRouteDto extends createZodDto(UpdateRouteRequestSchema) {}
export class OptimizeRouteDto extends createZodDto(
  OptimizeRouteRequestSchema,
) {}

// Query
export class GetAllRoutesQueryDto extends createZodDto(
  GetAllRoutesQuerySchema,
) {}

// Params
export class RouteIdParamDto extends createZodDto(GetRouteByIdParamsSchema) {}
export class UpdateRouteParamDto extends createZodDto(
  UpdateRouteParamsSchema,
) {}
export class DeleteRouteParamDto extends createZodDto(
  DeleteRouteParamsSchema,
) {}
export class OptimizeRouteParamDto extends createZodDto(
  OptimizeRouteParamsSchema,
) {}
