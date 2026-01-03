import { plainToClass, Type } from 'class-transformer';
import { IsEnum, IsInt, IsString, Min, validateSync } from 'class-validator';
import * as envTypes from '../types/env.types';

class EnvVariables implements envTypes.EnvironmentVariables {
  @IsEnum(envTypes.ENVIRONMENTS)
  NODE_ENV: envTypes.Environment;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  PORT: number;

  @IsString()
  MONGO_DATABASE_NAME: string;

  @IsString()
  MONGO_DATABASE_USERNAME: string;

  @IsString()
  MONGO_DATABASE_PASSWORD: string;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToClass(EnvVariables, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });
  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
}
