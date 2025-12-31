export const LocationsControllerMap = {
  name: 'locations',

  CREATE: '',
  GET_ALL: '',
  GET_BY_ID: ':id',
  UPDATE: ':id',
  DELETE: ':id',
} as const;

export const RoutesControllerMap = {
  name: 'routes',

  CREATE: '',
  GET_ALL: '',
  GET_BY_ID: ':id',
  UPDATE: ':id',
  DELETE: ':id',
  OPTIMIZE: ':id/optimize',
} as const;
