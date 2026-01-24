// export interface OptimizeRouteParams {
//   /** Maximum spending per person (UAH). */
//   budgetPerPerson: number;
//   /** Number of travellers in the group. */
//   peopleCount: number;
//   /** How many locations to include in the route (including start). */
//   locationCount: number;
//   /** Identifier of the starting location (MongoDB ObjectId). */
//   startPointId: string;
//   /** Maximum tour duration in minutes (including travel and stay). */
//   timeLimit: number;
//   /** Average time spent at each location in minutes. */
//   timePerLocation: number;
//   /** Preferred wine types used to filter locations. */
//   winePreferences: string[];
// }

/**
 * Request shape sent to the Python engine.
 *
 * The engine expects parameters such as the starting node (s_value),
 * the number of locations to visit (k_value) and optional limits
 * on budget, time and distance.
 * Additional fields such as a distance matrix and node identifiers are
 * included for completeness, although the current engine implementation
 * ignores unknown fields.
 */
export interface EngineSolveRequest {
  /** Data source selector; use 'excel' or 'tsplib' for the current engine. */
  data_source: 'excel' | 'tsplib';
  /** Index of the starting node. */
  s_value: number;
  /** Number of locations to visit. */
  k_value: number;
  /** Maximum allowed total budget. */
  budget_max?: number;
  /** Maximum allowed total time. */
  time_max?: number;
  /** Maximum allowed total distance (km). */
  dist_max?: number;
  /** Optimisation mode: minimise distance, budget or time. */
  mode?: 'min_distance' | 'min_budget' | 'min_time';
  /** Number of people in the group. */
  group_size?: number;
  /** Travel speed in kilometres per hour. */
  speed_kmph?: number;
  /** Optional custom matrix of distances between nodes (km). */
  matrix?: number[][];
  /** Ordered list of node identifiers corresponding to the matrix rows/columns. */
  nodes?: (string | number)[];
}

/**
 * Response shape returned by the engine solver.
 *
 * When the solver succeeds, `ok` is true and a tour of node indices is
 * provided.  Metrics capture the objective value and aggregated totals.
 */
export interface EngineSolveResponse {
  ok: boolean;
  tour?: number[];
  metrics?: {
    objective: number;
    total_distance: number;
    total_budget: number;
    total_time: number;
  };
  params?: Record<string, unknown>;
  error?: string;
  solver_status?: string;
  termination_condition?: string;
}
