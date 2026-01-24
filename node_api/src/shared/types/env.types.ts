export const ENVIRONMENTS = ['development', 'production'] as const;
export type Environment = (typeof ENVIRONMENTS)[number];

export interface EnvironmentVariables {
  NODE_ENV: Environment;
  PORT: number;
  MONGO_DATABASE_NAME: string;
  MONGO_DATABASE_USERNAME: string;
  MONGO_DATABASE_PASSWORD: string;
}
