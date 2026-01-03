import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { EnvironmentVariables, Environment } from '../types/env.types';

@Injectable()
export class AppConfigService {
  constructor(
    private readonly configService: ConfigService<EnvironmentVariables, true>,
  ) {}

  get<T>(name: keyof EnvironmentVariables) {
    return this.configService.get<T>(name, { infer: true });
  }

  getEnvMode() {
    return this.get<Environment>('NODE_ENV');
  }

  getMongoUri() {
    return `mongodb+srv://${this.getMongoUsername()}:${this.getMongoPassword()}@clusterstartlife.fgqvndc.mongodb.net/${this.getMongoName()}`;
  }

  getMongoName() {
    return this.get<string>('MONGO_DATABASE_NAME');
  }

  getMongoUsername() {
    return this.get<string>('MONGO_DATABASE_USERNAME');
  }

  getMongoPassword() {
    return this.get<string>('MONGO_DATABASE_PASSWORD');
  }
}
