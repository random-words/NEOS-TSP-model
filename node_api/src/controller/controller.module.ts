import { Module } from '@nestjs/common';
import { LocationsController } from './locations.controller';
import { RoutesController } from './routes.controller';

@Module({
  imports: [],
  controllers: [LocationsController, RoutesController],
  providers: [],
})
export class ControllerModule {}
