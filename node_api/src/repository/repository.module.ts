import { Module } from '@nestjs/common';
import { MongodbModule } from 'src/shared/config/mongodb/mongodb.module';
import { LocationsRepository } from './locations.repository';
import { RoutesRepository } from './routes.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Location, LocationSchema } from 'src/entity/Location.entity';
import { Route, RouteSchema } from 'src/entity/Route.entity';

@Module({
  imports: [
    MongodbModule,
    MongooseModule.forFeature([
      { name: Location.name, schema: LocationSchema },
      { name: Route.name, schema: RouteSchema },
    ]),
  ],
  providers: [LocationsRepository, RoutesRepository],
  exports: [LocationsRepository, RoutesRepository],
})
export class RepositoryModule {}
