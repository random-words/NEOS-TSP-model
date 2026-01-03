import { Module } from '@nestjs/common';
import { LocationsService } from './locations.service';
import { RoutesService } from './routes.service';
import { RepositoryModule } from 'src/repository/repository.module';

@Module({
  imports: [RepositoryModule],
  providers: [LocationsService, RoutesService],
  exports: [LocationsService, RoutesService],
})
export class ServiceModule {}
