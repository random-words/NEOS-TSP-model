import { Module } from '@nestjs/common';
import { LocationsController } from './locations.controller';
import { RoutesController } from './routes.controller';
import { ServiceModule } from 'src/service/service.module';

@Module({
  imports: [ServiceModule],
  controllers: [LocationsController, RoutesController],
  providers: [],
})
export class ControllerModule {}
