"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  ApiErrorSchema: () => ApiErrorSchema,
  ApiPaginatedResponseSchema: () => ApiPaginatedResponseSchema,
  ApiResponseSchema: () => ApiResponseSchema,
  CreateLocationRequestSchema: () => CreateLocationRequestSchema,
  CreateLocationResponseSchema: () => CreateLocationResponseSchema,
  CreateRouteRequestSchema: () => CreateRouteRequestSchema,
  CreateRouteResponseSchema: () => CreateRouteResponseSchema,
  DISTANCE_UNIT: () => DISTANCE_UNIT,
  DeleteLocationParamsSchema: () => DeleteLocationParamsSchema,
  DeleteLocationResponseSchema: () => DeleteLocationResponseSchema,
  DeleteRouteParamsSchema: () => DeleteRouteParamsSchema,
  DeleteRouteResponseSchema: () => DeleteRouteResponseSchema,
  GeoPointSchema: () => GeoPointSchema,
  GetAllLocationsQuerySchema: () => GetAllLocationsQuerySchema,
  GetAllLocationsResponseSchema: () => GetAllLocationsResponseSchema,
  GetAllRoutesQuerySchema: () => GetAllRoutesQuerySchema,
  GetAllRoutesResponseSchema: () => GetAllRoutesResponseSchema,
  GetAnchorsResponseSchema: () => GetAnchorsResponseSchema,
  GetLocationByIdParamsSchema: () => GetLocationByIdParamsSchema,
  GetLocationByIdResponseSchema: () => GetLocationByIdResponseSchema,
  GetRouteByIdParamsSchema: () => GetRouteByIdParamsSchema,
  GetRouteByIdResponseSchema: () => GetRouteByIdResponseSchema,
  LocationDtoSchema: () => LocationDtoSchema,
  LocationsControllerMap: () => LocationsControllerMap,
  OPTIMIZATION_MODES: () => OPTIMIZATION_MODES,
  ObjectIdSchema: () => ObjectIdSchema,
  OptimizeRouteParamsSchema: () => OptimizeRouteParamsSchema,
  OptimizeRouteRequestSchema: () => OptimizeRouteRequestSchema,
  OptimizeRouteResponseSchema: () => OptimizeRouteResponseSchema,
  PageMetaSchema: () => PageMetaSchema,
  PaginatedSchema: () => PaginatedSchema,
  PaginationQuerySchema: () => PaginationQuerySchema,
  ROUTE_ANCHORS: () => ROUTE_ANCHORS,
  ROUTE_ANCHORS_CONST: () => ROUTE_ANCHORS_CONST,
  RouteDtoSchema: () => RouteDtoSchema,
  RoutesControllerMap: () => RoutesControllerMap,
  TIME_UNIT: () => TIME_UNIT,
  UpdateLocationParamsSchema: () => UpdateLocationParamsSchema,
  UpdateLocationRequestSchema: () => UpdateLocationRequestSchema,
  UpdateLocationResponseSchema: () => UpdateLocationResponseSchema,
  UpdateRouteParamsSchema: () => UpdateRouteParamsSchema,
  UpdateRouteRequestSchema: () => UpdateRouteRequestSchema,
  UpdateRouteResponseSchema: () => UpdateRouteResponseSchema,
  WINE_FILTERS: () => WINE_FILTERS,
  WINE_TYPES: () => WINE_TYPES
});
module.exports = __toCommonJS(index_exports);

// src/shared/geo.ts
var import_zod = require("zod");
var GeoPointSchema = import_zod.z.object({
  type: import_zod.z.literal("Point"),
  coordinates: import_zod.z.tuple([import_zod.z.number(), import_zod.z.number()])
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
var import_zod2 = require("zod");
var ObjectIdSchema = import_zod2.z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId");
var ApiErrorSchema = import_zod2.z.object({
  code: import_zod2.z.string(),
  message: import_zod2.z.string(),
  details: import_zod2.z.unknown().optional()
});
var ApiResponseSchema = (data) => import_zod2.z.object({
  ok: import_zod2.z.boolean(),
  data: data.optional(),
  error: ApiErrorSchema.optional()
});
var PaginationQuerySchema = import_zod2.z.object({
  page: import_zod2.z.coerce.number().int().min(1).default(1),
  limit: import_zod2.z.coerce.number().int().min(1).max(100).default(20)
});
var PageMetaSchema = import_zod2.z.object({
  page: import_zod2.z.number().int().min(1),
  limit: import_zod2.z.number().int().min(1),
  total: import_zod2.z.number().int().min(0),
  hasNext: import_zod2.z.boolean()
});
var PaginatedSchema = (item) => import_zod2.z.object({
  items: import_zod2.z.array(item),
  meta: PageMetaSchema
});
var ApiPaginatedResponseSchema = (item) => ApiResponseSchema(PaginatedSchema(item));

// src/commands/locations/locations.contracts.ts
var import_zod3 = require("zod");
var LocationsControllerMap = {
  name: "locations",
  CREATE: "",
  GET_ALL: "",
  GET_BY_ID: ":id",
  UPDATE: ":id",
  DELETE: ":id"
};
var LocationDtoSchema = import_zod3.z.object({
  id: ObjectIdSchema,
  name: import_zod3.z.string(),
  description: import_zod3.z.string(),
  location: GeoPointSchema,
  address: import_zod3.z.string(),
  priceLevel: import_zod3.z.number().nonnegative(),
  imagesLinks: import_zod3.z.array(import_zod3.z.string()).default([]),
  avgStayMinutes: import_zod3.z.number().nonnegative(),
  avgTastingPricePerPerson: import_zod3.z.number().nonnegative(),
  avgMealPricePerPerson: import_zod3.z.number().nonnegative(),
  avgBottlePrice: import_zod3.z.number().nonnegative(),
  siteUrl: import_zod3.z.string(),
  contactNumber: import_zod3.z.string(),
  wineTags: import_zod3.z.array(import_zod3.z.enum(WINE_TYPES)).default([]),
  createdAt: import_zod3.z.string(),
  updatedAt: import_zod3.z.string()
});
var CreateLocationRequestSchema = LocationDtoSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var CreateLocationResponseSchema = ApiResponseSchema(LocationDtoSchema);
var GetAllLocationsQuerySchema = PaginationQuerySchema;
var GetAllLocationsResponseSchema = ApiPaginatedResponseSchema(LocationDtoSchema);
var GetLocationByIdParamsSchema = import_zod3.z.object({ id: ObjectIdSchema });
var GetLocationByIdResponseSchema = ApiResponseSchema(LocationDtoSchema);
var UpdateLocationParamsSchema = import_zod3.z.object({ id: ObjectIdSchema });
var UpdateLocationRequestSchema = CreateLocationRequestSchema.partial();
var UpdateLocationResponseSchema = ApiResponseSchema(LocationDtoSchema);
var DeleteLocationParamsSchema = import_zod3.z.object({ id: ObjectIdSchema });
var DeleteLocationResponseSchema = ApiResponseSchema(
  import_zod3.z.object({ deleted: import_zod3.z.boolean() })
);

// src/commands/routes/routes.contracts.ts
var import_zod4 = require("zod");
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
var RouteDtoSchema = import_zod4.z.object({
  id: ObjectIdSchema,
  name: import_zod4.z.string(),
  locationsMap: import_zod4.z.array(ObjectIdSchema),
  stopsCount: import_zod4.z.number().nonnegative(),
  totalDistance: import_zod4.z.number().nonnegative(),
  // meters
  totalTime: import_zod4.z.number().nonnegative(),
  // seconds
  visitOrder: import_zod4.z.array(import_zod4.z.number().int().nonnegative()).default([]),
  createdAt: import_zod4.z.string(),
  updatedAt: import_zod4.z.string()
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
  totalDistance: import_zod4.z.number().nonnegative().optional(),
  totalTime: import_zod4.z.number().nonnegative().optional()
});
var CreateRouteResponseSchema = ApiResponseSchema(RouteDtoSchema);
var GetAllRoutesQuerySchema = PaginationQuerySchema;
var GetAllRoutesResponseSchema = ApiPaginatedResponseSchema(RouteDtoSchema);
var GetRouteByIdParamsSchema = import_zod4.z.object({ id: ObjectIdSchema });
var GetRouteByIdResponseSchema = ApiResponseSchema(RouteDtoSchema);
var UpdateRouteParamsSchema = import_zod4.z.object({ id: ObjectIdSchema });
var UpdateRouteRequestSchema = CreateRouteRequestSchema.partial();
var UpdateRouteResponseSchema = ApiResponseSchema(RouteDtoSchema);
var DeleteRouteParamsSchema = import_zod4.z.object({ id: ObjectIdSchema });
var DeleteRouteResponseSchema = ApiResponseSchema(
  import_zod4.z.object({ deleted: import_zod4.z.boolean() })
);
var GetAnchorsResponseSchema = ApiResponseSchema(
  import_zod4.z.array(
    import_zod4.z.object({
      id: import_zod4.z.string(),
      name: import_zod4.z.string(),
      coordinates: import_zod4.z.tuple([import_zod4.z.number(), import_zod4.z.number()])
      // [lng, lat]
    })
  )
);
var OptimizeRouteParamsSchema = import_zod4.z.object({ id: ObjectIdSchema });
var OptimizeRouteRequestSchema = import_zod4.z.object({
  mode: import_zod4.z.enum(OPTIMIZATION_MODES),
  anchorId: import_zod4.z.string().optional()
  // якщо треба стартова точка з ROUTE_ANCHORS
});
var OptimizeRouteResponseSchema = ApiResponseSchema(RouteDtoSchema);
var ROUTE_ANCHORS_CONST = ROUTE_ANCHORS;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
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
});
