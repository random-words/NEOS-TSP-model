import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppConfigService } from '../app-config.service';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      inject: [AppConfigService],
      useFactory: (env: AppConfigService) => ({
        uri: env.getMongoUri(),
      }),
    }),
  ],
  controllers: [],
  providers: [],
})
export class MongodbModule {}
