import { Module } from '@nestjs/common';
import { ControllerModule } from './controller/controller.module';
import { AppConfigModule } from './shared/config/app-config.module';

@Module({
  imports: [ControllerModule, AppConfigModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
