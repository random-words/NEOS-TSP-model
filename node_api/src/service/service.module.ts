import { Module } from '@nestjs/common';
import { LocationsService } from './locations.service';
import { RoutesService } from './routes.service';

@Module({
  imports: [],
  providers: [LocationsService, RoutesService],
  exports: [LocationsService, RoutesService],
})
export class ServiceModule {}
