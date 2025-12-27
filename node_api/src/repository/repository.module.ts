import { Module } from '@nestjs/common';
import { MongodbModule } from 'src/shared/config/mongodb/mongodb.module';
import { LocationsRepository } from './locations.repository';
import { RoutesRepository } from './routes.repository';

@Module({
  imports: [MongodbModule],
  providers: [LocationsRepository, RoutesRepository],
  exports: [LocationsRepository, RoutesRepository],
})
export class RepositoryModule {}
