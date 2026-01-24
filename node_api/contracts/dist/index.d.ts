import { z } from 'zod';

type LngLat = readonly [lng: number, lat: number];
type GeoPoint = {
    type: 'Point';
    coordinates: LngLat;
};
declare const GeoPointSchema: z.ZodObject<{
    type: z.ZodLiteral<"Point">;
    coordinates: z.ZodTuple<[z.ZodNumber, z.ZodNumber], null>;
}, z.core.$strip>;

declare const OPTIMIZATION_MODES: readonly ["BUDGET", "TIME", "DISTANCE"];
type OptimizationMode = (typeof OPTIMIZATION_MODES)[number];
declare const DISTANCE_UNIT: "m";
declare const TIME_UNIT: "s";
type RouteAnchor = {
    id: string;
    name: string;
    coordinates: LngLat;
};
declare const ROUTE_ANCHORS: readonly [{
    readonly id: "uzhhorod";
    readonly name: "Uzhhorod";
    readonly coordinates: readonly [22.2895, 48.6217];
}];

declare const WINE_TYPES: readonly ["ORANGE", "WHITE", "NATURAL", "ROSE", "MIX", "SPARKLING", "RED"];
type WineType = (typeof WINE_TYPES)[number];
declare const WINE_FILTERS: readonly ["ALL", "ORANGE", "WHITE", "NATURAL", "ROSE", "MIX", "SPARKLING", "RED"];
type WineFilter = (typeof WINE_FILTERS)[number];

declare const ObjectIdSchema: z.ZodString;
type ObjectIdString = z.infer<typeof ObjectIdSchema>;
declare const ApiErrorSchema: z.ZodObject<{
    code: z.ZodString;
    message: z.ZodString;
    details: z.ZodOptional<z.ZodUnknown>;
}, z.core.$strip>;
declare const ApiResponseSchema: <T extends z.ZodTypeAny>(data: T) => z.ZodObject<{
    ok: z.ZodBoolean;
    data: z.ZodOptional<T>;
    error: z.ZodOptional<z.ZodObject<{
        code: z.ZodString;
        message: z.ZodString;
        details: z.ZodOptional<z.ZodUnknown>;
    }, z.core.$strip>>;
}, z.core.$strip>;
declare const PaginationQuerySchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
}, z.core.$strip>;
type PaginationQuery = z.infer<typeof PaginationQuerySchema>;
declare const PageMetaSchema: z.ZodObject<{
    page: z.ZodNumber;
    limit: z.ZodNumber;
    total: z.ZodNumber;
    hasNext: z.ZodBoolean;
}, z.core.$strip>;
type PageMeta = z.infer<typeof PageMetaSchema>;
declare const PaginatedSchema: <T extends z.ZodTypeAny>(item: T) => z.ZodObject<{
    items: z.ZodArray<T>;
    meta: z.ZodObject<{
        page: z.ZodNumber;
        limit: z.ZodNumber;
        total: z.ZodNumber;
        hasNext: z.ZodBoolean;
    }, z.core.$strip>;
}, z.core.$strip>;
declare const ApiPaginatedResponseSchema: <T extends z.ZodTypeAny>(item: T) => z.ZodObject<{
    ok: z.ZodBoolean;
    data: z.ZodOptional<z.ZodObject<{
        items: z.ZodArray<T>;
        meta: z.ZodObject<{
            page: z.ZodNumber;
            limit: z.ZodNumber;
            total: z.ZodNumber;
            hasNext: z.ZodBoolean;
        }, z.core.$strip>;
    }, z.core.$strip>>;
    error: z.ZodOptional<z.ZodObject<{
        code: z.ZodString;
        message: z.ZodString;
        details: z.ZodOptional<z.ZodUnknown>;
    }, z.core.$strip>>;
}, z.core.$strip>;

declare const LocationsControllerMap: {
    readonly name: "locations";
    readonly CREATE: "";
    readonly GET_ALL: "";
    readonly GET_BY_ID: ":id";
    readonly UPDATE: ":id";
    readonly DELETE: ":id";
};
declare const LocationDtoSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    description: z.ZodString;
    location: z.ZodObject<{
        type: z.ZodLiteral<"Point">;
        coordinates: z.ZodTuple<[z.ZodNumber, z.ZodNumber], null>;
    }, z.core.$strip>;
    address: z.ZodString;
    priceLevel: z.ZodNumber;
    imagesLinks: z.ZodDefault<z.ZodArray<z.ZodString>>;
    avgStayMinutes: z.ZodNumber;
    avgTastingPricePerPerson: z.ZodNumber;
    avgMealPricePerPerson: z.ZodNumber;
    avgBottlePrice: z.ZodNumber;
    siteUrl: z.ZodString;
    contactNumber: z.ZodString;
    wineTags: z.ZodDefault<z.ZodArray<z.ZodEnum<{
        ORANGE: "ORANGE";
        WHITE: "WHITE";
        NATURAL: "NATURAL";
        ROSE: "ROSE";
        MIX: "MIX";
        SPARKLING: "SPARKLING";
        RED: "RED";
    }>>>;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, z.core.$strip>;
type LocationDto = z.infer<typeof LocationDtoSchema>;
declare const CreateLocationRequestSchema: z.ZodObject<{
    description: z.ZodString;
    location: z.ZodObject<{
        type: z.ZodLiteral<"Point">;
        coordinates: z.ZodTuple<[z.ZodNumber, z.ZodNumber], null>;
    }, z.core.$strip>;
    name: z.ZodString;
    address: z.ZodString;
    priceLevel: z.ZodNumber;
    imagesLinks: z.ZodDefault<z.ZodArray<z.ZodString>>;
    avgStayMinutes: z.ZodNumber;
    avgTastingPricePerPerson: z.ZodNumber;
    avgMealPricePerPerson: z.ZodNumber;
    avgBottlePrice: z.ZodNumber;
    siteUrl: z.ZodString;
    contactNumber: z.ZodString;
    wineTags: z.ZodDefault<z.ZodArray<z.ZodEnum<{
        ORANGE: "ORANGE";
        WHITE: "WHITE";
        NATURAL: "NATURAL";
        ROSE: "ROSE";
        MIX: "MIX";
        SPARKLING: "SPARKLING";
        RED: "RED";
    }>>>;
}, z.core.$strip>;
type CreateLocationRequest = z.infer<typeof CreateLocationRequestSchema>;
declare const CreateLocationResponseSchema: z.ZodObject<{
    ok: z.ZodBoolean;
    data: z.ZodOptional<z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        description: z.ZodString;
        location: z.ZodObject<{
            type: z.ZodLiteral<"Point">;
            coordinates: z.ZodTuple<[z.ZodNumber, z.ZodNumber], null>;
        }, z.core.$strip>;
        address: z.ZodString;
        priceLevel: z.ZodNumber;
        imagesLinks: z.ZodDefault<z.ZodArray<z.ZodString>>;
        avgStayMinutes: z.ZodNumber;
        avgTastingPricePerPerson: z.ZodNumber;
        avgMealPricePerPerson: z.ZodNumber;
        avgBottlePrice: z.ZodNumber;
        siteUrl: z.ZodString;
        contactNumber: z.ZodString;
        wineTags: z.ZodDefault<z.ZodArray<z.ZodEnum<{
            ORANGE: "ORANGE";
            WHITE: "WHITE";
            NATURAL: "NATURAL";
            ROSE: "ROSE";
            MIX: "MIX";
            SPARKLING: "SPARKLING";
            RED: "RED";
        }>>>;
        createdAt: z.ZodString;
        updatedAt: z.ZodString;
    }, z.core.$strip>>;
    error: z.ZodOptional<z.ZodObject<{
        code: z.ZodString;
        message: z.ZodString;
        details: z.ZodOptional<z.ZodUnknown>;
    }, z.core.$strip>>;
}, z.core.$strip>;
type CreateLocationResponse = z.infer<typeof CreateLocationResponseSchema>;
declare const GetAllLocationsQuerySchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
}, z.core.$strip>;
type GetAllLocationsQuery = z.infer<typeof GetAllLocationsQuerySchema>;
declare const GetAllLocationsResponseSchema: z.ZodObject<{
    ok: z.ZodBoolean;
    data: z.ZodOptional<z.ZodObject<{
        items: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            name: z.ZodString;
            description: z.ZodString;
            location: z.ZodObject<{
                type: z.ZodLiteral<"Point">;
                coordinates: z.ZodTuple<[z.ZodNumber, z.ZodNumber], null>;
            }, z.core.$strip>;
            address: z.ZodString;
            priceLevel: z.ZodNumber;
            imagesLinks: z.ZodDefault<z.ZodArray<z.ZodString>>;
            avgStayMinutes: z.ZodNumber;
            avgTastingPricePerPerson: z.ZodNumber;
            avgMealPricePerPerson: z.ZodNumber;
            avgBottlePrice: z.ZodNumber;
            siteUrl: z.ZodString;
            contactNumber: z.ZodString;
            wineTags: z.ZodDefault<z.ZodArray<z.ZodEnum<{
                ORANGE: "ORANGE";
                WHITE: "WHITE";
                NATURAL: "NATURAL";
                ROSE: "ROSE";
                MIX: "MIX";
                SPARKLING: "SPARKLING";
                RED: "RED";
            }>>>;
            createdAt: z.ZodString;
            updatedAt: z.ZodString;
        }, z.core.$strip>>;
        meta: z.ZodObject<{
            page: z.ZodNumber;
            limit: z.ZodNumber;
            total: z.ZodNumber;
            hasNext: z.ZodBoolean;
        }, z.core.$strip>;
    }, z.core.$strip>>;
    error: z.ZodOptional<z.ZodObject<{
        code: z.ZodString;
        message: z.ZodString;
        details: z.ZodOptional<z.ZodUnknown>;
    }, z.core.$strip>>;
}, z.core.$strip>;
type GetAllLocationsResponse = z.infer<typeof GetAllLocationsResponseSchema>;
declare const GetLocationByIdParamsSchema: z.ZodObject<{
    id: z.ZodString;
}, z.core.$strip>;
type GetLocationByIdParams = z.infer<typeof GetLocationByIdParamsSchema>;
declare const GetLocationByIdResponseSchema: z.ZodObject<{
    ok: z.ZodBoolean;
    data: z.ZodOptional<z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        description: z.ZodString;
        location: z.ZodObject<{
            type: z.ZodLiteral<"Point">;
            coordinates: z.ZodTuple<[z.ZodNumber, z.ZodNumber], null>;
        }, z.core.$strip>;
        address: z.ZodString;
        priceLevel: z.ZodNumber;
        imagesLinks: z.ZodDefault<z.ZodArray<z.ZodString>>;
        avgStayMinutes: z.ZodNumber;
        avgTastingPricePerPerson: z.ZodNumber;
        avgMealPricePerPerson: z.ZodNumber;
        avgBottlePrice: z.ZodNumber;
        siteUrl: z.ZodString;
        contactNumber: z.ZodString;
        wineTags: z.ZodDefault<z.ZodArray<z.ZodEnum<{
            ORANGE: "ORANGE";
            WHITE: "WHITE";
            NATURAL: "NATURAL";
            ROSE: "ROSE";
            MIX: "MIX";
            SPARKLING: "SPARKLING";
            RED: "RED";
        }>>>;
        createdAt: z.ZodString;
        updatedAt: z.ZodString;
    }, z.core.$strip>>;
    error: z.ZodOptional<z.ZodObject<{
        code: z.ZodString;
        message: z.ZodString;
        details: z.ZodOptional<z.ZodUnknown>;
    }, z.core.$strip>>;
}, z.core.$strip>;
type GetLocationByIdResponse = z.infer<typeof GetLocationByIdResponseSchema>;
declare const UpdateLocationParamsSchema: z.ZodObject<{
    id: z.ZodString;
}, z.core.$strip>;
type UpdateLocationParams = z.infer<typeof UpdateLocationParamsSchema>;
declare const UpdateLocationRequestSchema: z.ZodObject<{
    description: z.ZodOptional<z.ZodString>;
    location: z.ZodOptional<z.ZodObject<{
        type: z.ZodLiteral<"Point">;
        coordinates: z.ZodTuple<[z.ZodNumber, z.ZodNumber], null>;
    }, z.core.$strip>>;
    name: z.ZodOptional<z.ZodString>;
    address: z.ZodOptional<z.ZodString>;
    priceLevel: z.ZodOptional<z.ZodNumber>;
    imagesLinks: z.ZodOptional<z.ZodDefault<z.ZodArray<z.ZodString>>>;
    avgStayMinutes: z.ZodOptional<z.ZodNumber>;
    avgTastingPricePerPerson: z.ZodOptional<z.ZodNumber>;
    avgMealPricePerPerson: z.ZodOptional<z.ZodNumber>;
    avgBottlePrice: z.ZodOptional<z.ZodNumber>;
    siteUrl: z.ZodOptional<z.ZodString>;
    contactNumber: z.ZodOptional<z.ZodString>;
    wineTags: z.ZodOptional<z.ZodDefault<z.ZodArray<z.ZodEnum<{
        ORANGE: "ORANGE";
        WHITE: "WHITE";
        NATURAL: "NATURAL";
        ROSE: "ROSE";
        MIX: "MIX";
        SPARKLING: "SPARKLING";
        RED: "RED";
    }>>>>;
}, z.core.$strip>;
type UpdateLocationRequest = z.infer<typeof UpdateLocationRequestSchema>;
declare const UpdateLocationResponseSchema: z.ZodObject<{
    ok: z.ZodBoolean;
    data: z.ZodOptional<z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        description: z.ZodString;
        location: z.ZodObject<{
            type: z.ZodLiteral<"Point">;
            coordinates: z.ZodTuple<[z.ZodNumber, z.ZodNumber], null>;
        }, z.core.$strip>;
        address: z.ZodString;
        priceLevel: z.ZodNumber;
        imagesLinks: z.ZodDefault<z.ZodArray<z.ZodString>>;
        avgStayMinutes: z.ZodNumber;
        avgTastingPricePerPerson: z.ZodNumber;
        avgMealPricePerPerson: z.ZodNumber;
        avgBottlePrice: z.ZodNumber;
        siteUrl: z.ZodString;
        contactNumber: z.ZodString;
        wineTags: z.ZodDefault<z.ZodArray<z.ZodEnum<{
            ORANGE: "ORANGE";
            WHITE: "WHITE";
            NATURAL: "NATURAL";
            ROSE: "ROSE";
            MIX: "MIX";
            SPARKLING: "SPARKLING";
            RED: "RED";
        }>>>;
        createdAt: z.ZodString;
        updatedAt: z.ZodString;
    }, z.core.$strip>>;
    error: z.ZodOptional<z.ZodObject<{
        code: z.ZodString;
        message: z.ZodString;
        details: z.ZodOptional<z.ZodUnknown>;
    }, z.core.$strip>>;
}, z.core.$strip>;
type UpdateLocationResponse = z.infer<typeof UpdateLocationResponseSchema>;
declare const DeleteLocationParamsSchema: z.ZodObject<{
    id: z.ZodString;
}, z.core.$strip>;
type DeleteLocationParams = z.infer<typeof DeleteLocationParamsSchema>;
declare const DeleteLocationResponseSchema: z.ZodObject<{
    ok: z.ZodBoolean;
    data: z.ZodOptional<z.ZodObject<{
        deleted: z.ZodBoolean;
    }, z.core.$strip>>;
    error: z.ZodOptional<z.ZodObject<{
        code: z.ZodString;
        message: z.ZodString;
        details: z.ZodOptional<z.ZodUnknown>;
    }, z.core.$strip>>;
}, z.core.$strip>;
type DeleteLocationResponse = z.infer<typeof DeleteLocationResponseSchema>;

declare const RoutesControllerMap: {
    readonly name: "routes";
    readonly CREATE: "";
    readonly GET_ALL: "";
    readonly GET_BY_ID: ":id";
    readonly UPDATE: ":id";
    readonly DELETE: ":id";
    readonly OPTIMIZE: ":id/optimize";
    readonly GET_ANCHORS: "anchors";
};
declare const RouteDtoSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    locationsMap: z.ZodArray<z.ZodString>;
    stopsCount: z.ZodNumber;
    totalDistance: z.ZodNumber;
    totalTime: z.ZodNumber;
    visitOrder: z.ZodDefault<z.ZodArray<z.ZodNumber>>;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, z.core.$strip>;
type RouteDto = z.infer<typeof RouteDtoSchema>;
declare const CreateRouteRequestSchema: z.ZodObject<{
    name: z.ZodString;
    locationsMap: z.ZodArray<z.ZodString>;
    stopsCount: z.ZodNumber;
    totalDistance: z.ZodOptional<z.ZodNumber>;
    totalTime: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
type CreateRouteRequest = z.infer<typeof CreateRouteRequestSchema>;
declare const CreateRouteResponseSchema: z.ZodObject<{
    ok: z.ZodBoolean;
    data: z.ZodOptional<z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        locationsMap: z.ZodArray<z.ZodString>;
        stopsCount: z.ZodNumber;
        totalDistance: z.ZodNumber;
        totalTime: z.ZodNumber;
        visitOrder: z.ZodDefault<z.ZodArray<z.ZodNumber>>;
        createdAt: z.ZodString;
        updatedAt: z.ZodString;
    }, z.core.$strip>>;
    error: z.ZodOptional<z.ZodObject<{
        code: z.ZodString;
        message: z.ZodString;
        details: z.ZodOptional<z.ZodUnknown>;
    }, z.core.$strip>>;
}, z.core.$strip>;
type CreateRouteResponse = z.infer<typeof CreateRouteResponseSchema>;
declare const GetAllRoutesQuerySchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
}, z.core.$strip>;
type GetAllRoutesQuery = z.infer<typeof GetAllRoutesQuerySchema>;
declare const GetAllRoutesResponseSchema: z.ZodObject<{
    ok: z.ZodBoolean;
    data: z.ZodOptional<z.ZodObject<{
        items: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            name: z.ZodString;
            locationsMap: z.ZodArray<z.ZodString>;
            stopsCount: z.ZodNumber;
            totalDistance: z.ZodNumber;
            totalTime: z.ZodNumber;
            visitOrder: z.ZodDefault<z.ZodArray<z.ZodNumber>>;
            createdAt: z.ZodString;
            updatedAt: z.ZodString;
        }, z.core.$strip>>;
        meta: z.ZodObject<{
            page: z.ZodNumber;
            limit: z.ZodNumber;
            total: z.ZodNumber;
            hasNext: z.ZodBoolean;
        }, z.core.$strip>;
    }, z.core.$strip>>;
    error: z.ZodOptional<z.ZodObject<{
        code: z.ZodString;
        message: z.ZodString;
        details: z.ZodOptional<z.ZodUnknown>;
    }, z.core.$strip>>;
}, z.core.$strip>;
type GetAllRoutesResponse = z.infer<typeof GetAllRoutesResponseSchema>;
declare const GetRouteByIdParamsSchema: z.ZodObject<{
    id: z.ZodString;
}, z.core.$strip>;
type GetRouteByIdParams = z.infer<typeof GetRouteByIdParamsSchema>;
declare const GetRouteByIdResponseSchema: z.ZodObject<{
    ok: z.ZodBoolean;
    data: z.ZodOptional<z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        locationsMap: z.ZodArray<z.ZodString>;
        stopsCount: z.ZodNumber;
        totalDistance: z.ZodNumber;
        totalTime: z.ZodNumber;
        visitOrder: z.ZodDefault<z.ZodArray<z.ZodNumber>>;
        createdAt: z.ZodString;
        updatedAt: z.ZodString;
    }, z.core.$strip>>;
    error: z.ZodOptional<z.ZodObject<{
        code: z.ZodString;
        message: z.ZodString;
        details: z.ZodOptional<z.ZodUnknown>;
    }, z.core.$strip>>;
}, z.core.$strip>;
type GetRouteByIdResponse = z.infer<typeof GetRouteByIdResponseSchema>;
declare const UpdateRouteParamsSchema: z.ZodObject<{
    id: z.ZodString;
}, z.core.$strip>;
type UpdateRouteParams = z.infer<typeof UpdateRouteParamsSchema>;
declare const UpdateRouteRequestSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    locationsMap: z.ZodOptional<z.ZodArray<z.ZodString>>;
    stopsCount: z.ZodOptional<z.ZodNumber>;
    totalDistance: z.ZodOptional<z.ZodOptional<z.ZodNumber>>;
    totalTime: z.ZodOptional<z.ZodOptional<z.ZodNumber>>;
}, z.core.$strip>;
type UpdateRouteRequest = z.infer<typeof UpdateRouteRequestSchema>;
declare const UpdateRouteResponseSchema: z.ZodObject<{
    ok: z.ZodBoolean;
    data: z.ZodOptional<z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        locationsMap: z.ZodArray<z.ZodString>;
        stopsCount: z.ZodNumber;
        totalDistance: z.ZodNumber;
        totalTime: z.ZodNumber;
        visitOrder: z.ZodDefault<z.ZodArray<z.ZodNumber>>;
        createdAt: z.ZodString;
        updatedAt: z.ZodString;
    }, z.core.$strip>>;
    error: z.ZodOptional<z.ZodObject<{
        code: z.ZodString;
        message: z.ZodString;
        details: z.ZodOptional<z.ZodUnknown>;
    }, z.core.$strip>>;
}, z.core.$strip>;
type UpdateRouteResponse = z.infer<typeof UpdateRouteResponseSchema>;
declare const DeleteRouteParamsSchema: z.ZodObject<{
    id: z.ZodString;
}, z.core.$strip>;
type DeleteRouteParams = z.infer<typeof DeleteRouteParamsSchema>;
declare const DeleteRouteResponseSchema: z.ZodObject<{
    ok: z.ZodBoolean;
    data: z.ZodOptional<z.ZodObject<{
        deleted: z.ZodBoolean;
    }, z.core.$strip>>;
    error: z.ZodOptional<z.ZodObject<{
        code: z.ZodString;
        message: z.ZodString;
        details: z.ZodOptional<z.ZodUnknown>;
    }, z.core.$strip>>;
}, z.core.$strip>;
type DeleteRouteResponse = z.infer<typeof DeleteRouteResponseSchema>;
declare const GetAnchorsResponseSchema: z.ZodObject<{
    ok: z.ZodBoolean;
    data: z.ZodOptional<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        coordinates: z.ZodTuple<[z.ZodNumber, z.ZodNumber], null>;
    }, z.core.$strip>>>;
    error: z.ZodOptional<z.ZodObject<{
        code: z.ZodString;
        message: z.ZodString;
        details: z.ZodOptional<z.ZodUnknown>;
    }, z.core.$strip>>;
}, z.core.$strip>;
type GetAnchorsResponse = z.infer<typeof GetAnchorsResponseSchema>;
declare const OptimizeRouteParamsSchema: z.ZodObject<{
    id: z.ZodString;
    budgetPerPerson: z.ZodNumber;
    peopleCount: z.ZodNumber;
    locationCount: z.ZodNumber;
    startPointId: z.ZodString;
    timeLimit: z.ZodNumber;
    timePerLocation: z.ZodNumber;
    winePreferences: z.ZodArray<z.ZodString>;
}, z.core.$strip>;
type OptimizeRouteParams = z.infer<typeof OptimizeRouteParamsSchema>;
declare const OptimizeRouteRequestSchema: z.ZodObject<{
    mode: z.ZodEnum<{
        BUDGET: "BUDGET";
        TIME: "TIME";
        DISTANCE: "DISTANCE";
    }>;
    anchorId: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
type OptimizeRouteRequest = z.infer<typeof OptimizeRouteRequestSchema>;
declare const OptimizeRouteResponseSchema: z.ZodObject<{
    ok: z.ZodBoolean;
    data: z.ZodOptional<z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        locationsMap: z.ZodArray<z.ZodString>;
        stopsCount: z.ZodNumber;
        totalDistance: z.ZodNumber;
        totalTime: z.ZodNumber;
        visitOrder: z.ZodDefault<z.ZodArray<z.ZodNumber>>;
        createdAt: z.ZodString;
        updatedAt: z.ZodString;
    }, z.core.$strip>>;
    error: z.ZodOptional<z.ZodObject<{
        code: z.ZodString;
        message: z.ZodString;
        details: z.ZodOptional<z.ZodUnknown>;
    }, z.core.$strip>>;
}, z.core.$strip>;
type OptimizeRouteResponse = z.infer<typeof OptimizeRouteResponseSchema>;
declare const ROUTE_ANCHORS_CONST: readonly [{
    readonly id: "uzhhorod";
    readonly name: "Uzhhorod";
    readonly coordinates: readonly [22.2895, 48.6217];
}];

export { ApiErrorSchema, ApiPaginatedResponseSchema, ApiResponseSchema, type CreateLocationRequest, CreateLocationRequestSchema, type CreateLocationResponse, CreateLocationResponseSchema, type CreateRouteRequest, CreateRouteRequestSchema, type CreateRouteResponse, CreateRouteResponseSchema, DISTANCE_UNIT, type DeleteLocationParams, DeleteLocationParamsSchema, type DeleteLocationResponse, DeleteLocationResponseSchema, type DeleteRouteParams, DeleteRouteParamsSchema, type DeleteRouteResponse, DeleteRouteResponseSchema, type GeoPoint, GeoPointSchema, type GetAllLocationsQuery, GetAllLocationsQuerySchema, type GetAllLocationsResponse, GetAllLocationsResponseSchema, type GetAllRoutesQuery, GetAllRoutesQuerySchema, type GetAllRoutesResponse, GetAllRoutesResponseSchema, type GetAnchorsResponse, GetAnchorsResponseSchema, type GetLocationByIdParams, GetLocationByIdParamsSchema, type GetLocationByIdResponse, GetLocationByIdResponseSchema, type GetRouteByIdParams, GetRouteByIdParamsSchema, type GetRouteByIdResponse, GetRouteByIdResponseSchema, type LngLat, type LocationDto, LocationDtoSchema, LocationsControllerMap, OPTIMIZATION_MODES, ObjectIdSchema, type ObjectIdString, type OptimizationMode, type OptimizeRouteParams, OptimizeRouteParamsSchema, type OptimizeRouteRequest, OptimizeRouteRequestSchema, type OptimizeRouteResponse, OptimizeRouteResponseSchema, type PageMeta, PageMetaSchema, PaginatedSchema, type PaginationQuery, PaginationQuerySchema, ROUTE_ANCHORS, ROUTE_ANCHORS_CONST, type RouteAnchor, type RouteDto, RouteDtoSchema, RoutesControllerMap, TIME_UNIT, type UpdateLocationParams, UpdateLocationParamsSchema, type UpdateLocationRequest, UpdateLocationRequestSchema, type UpdateLocationResponse, UpdateLocationResponseSchema, type UpdateRouteParams, UpdateRouteParamsSchema, type UpdateRouteRequest, UpdateRouteRequestSchema, type UpdateRouteResponse, UpdateRouteResponseSchema, WINE_FILTERS, WINE_TYPES, type WineFilter, type WineType };
