// src/shared/geo.ts
import { z } from "zod";
var GeoPointSchema = z.object({
  type: z.literal("Point"),
  coordinates: z.tuple([z.number(), z.number()])
  // [lng, lat]
});

// src/shared/route.ts
var OPTIMIZATION_MODES = ["BUDGET", "TIME", "DISTANCE"];
var DISTANCE_UNIT = "m";
var TIME_UNIT = "s";
var ROUTE_ANCHORS = [
  { id: "uzhhorod", name: "Uzhhorod", coordinates: [22.2895, 48.6217] }
];

// src/shared/wine.ts
var WINE_TYPES = [
  "ORANGE",
  "WHITE",
  "NATURAL",
  "ROSE",
  "MIX",
  "SPARKLING",
  "RED"
];
var WINE_FILTERS = ["ALL", ...WINE_TYPES];

// src/commands/_shared.ts
import { z as z2 } from "zod";
var ObjectIdSchema = z2.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId");
var ApiErrorSchema = z2.object({
  code: z2.string(),
  message: z2.string(),
  details: z2.unknown().optional()
});
var ApiResponseSchema = (data) => z2.object({
  ok: z2.boolean(),
  data: data.optional(),
  error: ApiErrorSchema.optional()
});
var PaginationQuerySchema = z2.object({
  page: z2.coerce.number().int().min(1).default(1),
  limit: z2.coerce.number().int().min(1).max(100).default(20)
});
var PageMetaSchema = z2.object({
  page: z2.number().int().min(1),
  limit: z2.number().int().min(1),
  total: z2.number().int().min(0),
  hasNext: z2.boolean()
});
var PaginatedSchema = (item) => z2.object({
  items: z2.array(item),
  meta: PageMetaSchema
});
var ApiPaginatedResponseSchema = (item) => ApiResponseSchema(PaginatedSchema(item));

// src/commands/locations/locations.contracts.ts
import { z as z3 } from "zod";
var LocationsControllerMap = {
  name: "locations",
  CREATE: "",
  GET_ALL: "",
  GET_BY_ID: ":id",
  UPDATE: ":id",
  DELETE: ":id"
};
var LocationDtoSchema = z3.object({
  id: ObjectIdSchema,
  name: z3.string(),
  description: z3.string(),
  location: GeoPointSchema,
  address: z3.string(),
  priceLevel: z3.number().nonnegative(),
  imagesLinks: z3.array(z3.string()).default([]),
  avgStayMinutes: z3.number().nonnegative(),
  avgTastingPricePerPerson: z3.number().nonnegative(),
  avgMealPricePerPerson: z3.number().nonnegative(),
  avgBottlePrice: z3.number().nonnegative(),
  siteUrl: z3.string(),
  contactNumber: z3.string(),
  wineTags: z3.array(z3.enum(WINE_TYPES)).default([]),
  createdAt: z3.string(),
  updatedAt: z3.string()
});
var CreateLocationRequestSchema = LocationDtoSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var CreateLocationResponseSchema = ApiResponseSchema(LocationDtoSchema);
var GetAllLocationsQuerySchema = PaginationQuerySchema;
var GetAllLocationsResponseSchema = ApiPaginatedResponseSchema(LocationDtoSchema);
var GetLocationByIdParamsSchema = z3.object({ id: ObjectIdSchema });
var GetLocationByIdResponseSchema = ApiResponseSchema(LocationDtoSchema);
var UpdateLocationParamsSchema = z3.object({ id: ObjectIdSchema });
var UpdateLocationRequestSchema = CreateLocationRequestSchema.partial();
var UpdateLocationResponseSchema = ApiResponseSchema(LocationDtoSchema);
var DeleteLocationParamsSchema = z3.object({ id: ObjectIdSchema });
var DeleteLocationResponseSchema = ApiResponseSchema(
  z3.object({ deleted: z3.boolean() })
);

// src/commands/routes/routes.contracts.ts
import { z as z4 } from "zod";
var RoutesControllerMap = {
  name: "routes",
  CREATE: "",
  GET_ALL: "",
  GET_BY_ID: ":id",
  UPDATE: ":id",
  DELETE: ":id",
  OPTIMIZE: ":id/optimize",
  GET_ANCHORS: "anchors"
};
var RouteDtoSchema = z4.object({
  id: ObjectIdSchema,
  name: z4.string(),
  locationsMap: z4.array(ObjectIdSchema),
  stopsCount: z4.number().nonnegative(),
  totalDistance: z4.number().nonnegative(),
  // meters
  totalTime: z4.number().nonnegative(),
  // seconds
  visitOrder: z4.array(z4.number().int().nonnegative()).default([]),
  createdAt: z4.string(),
  updatedAt: z4.string()
});
var CreateRouteRequestSchema = RouteDtoSchema.omit({
  id: true,
  totalDistance: true,
  totalTime: true,
  visitOrder: true,
  createdAt: true,
  updatedAt: true
}).extend({
  // MVP: totals можуть порахуватись беком
  totalDistance: z4.number().nonnegative().optional(),
  totalTime: z4.number().nonnegative().optional()
});
var CreateRouteResponseSchema = ApiResponseSchema(RouteDtoSchema);
var GetAllRoutesQuerySchema = PaginationQuerySchema;
var GetAllRoutesResponseSchema = ApiPaginatedResponseSchema(RouteDtoSchema);
var GetRouteByIdParamsSchema = z4.object({ id: ObjectIdSchema });
var GetRouteByIdResponseSchema = ApiResponseSchema(RouteDtoSchema);
var UpdateRouteParamsSchema = z4.object({ id: ObjectIdSchema });
var UpdateRouteRequestSchema = CreateRouteRequestSchema.partial();
var UpdateRouteResponseSchema = ApiResponseSchema(RouteDtoSchema);
var DeleteRouteParamsSchema = z4.object({ id: ObjectIdSchema });
var DeleteRouteResponseSchema = ApiResponseSchema(
  z4.object({ deleted: z4.boolean() })
);
var GetAnchorsResponseSchema = ApiResponseSchema(
  z4.array(
    z4.object({
      id: z4.string(),
      name: z4.string(),
      coordinates: z4.tuple([z4.number(), z4.number()])
      // [lng, lat]
    })
  )
);
var OptimizeRouteParamsSchema = z4.object({ id: ObjectIdSchema });
var OptimizeRouteRequestSchema = z4.object({
  mode: z4.enum(OPTIMIZATION_MODES),
  anchorId: z4.string().optional()
  // якщо треба стартова точка з ROUTE_ANCHORS
});
var OptimizeRouteResponseSchema = ApiResponseSchema(RouteDtoSchema);
var ROUTE_ANCHORS_CONST = ROUTE_ANCHORS;
export {
  ApiErrorSchema,
  ApiPaginatedResponseSchema,
  ApiResponseSchema,
  CreateLocationRequestSchema,
  CreateLocationResponseSchema,
  CreateRouteRequestSchema,
  CreateRouteResponseSchema,
  DISTANCE_UNIT,
  DeleteLocationParamsSchema,
  DeleteLocationResponseSchema,
  DeleteRouteParamsSchema,
  DeleteRouteResponseSchema,
  GeoPointSchema,
  GetAllLocationsQuerySchema,
  GetAllLocationsResponseSchema,
  GetAllRoutesQuerySchema,
  GetAllRoutesResponseSchema,
  GetAnchorsResponseSchema,
  GetLocationByIdParamsSchema,
  GetLocationByIdResponseSchema,
  GetRouteByIdParamsSchema,
  GetRouteByIdResponseSchema,
  LocationDtoSchema,
  LocationsControllerMap,
  OPTIMIZATION_MODES,
  ObjectIdSchema,
  OptimizeRouteParamsSchema,
  OptimizeRouteRequestSchema,
  OptimizeRouteResponseSchema,
  PageMetaSchema,
  PaginatedSchema,
  PaginationQuerySchema,
  ROUTE_ANCHORS,
  ROUTE_ANCHORS_CONST,
  RouteDtoSchema,
  RoutesControllerMap,
  TIME_UNIT,
  UpdateLocationParamsSchema,
  UpdateLocationRequestSchema,
  UpdateLocationResponseSchema,
  UpdateRouteParamsSchema,
  UpdateRouteRequestSchema,
  UpdateRouteResponseSchema,
  WINE_FILTERS,
  WINE_TYPES
};
