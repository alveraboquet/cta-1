import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';

import { ApiAgentsModule } from '@cta/api/agents';
import { ApiAuthModule } from '@cta/api/auth';
import { ApiBackTestsModule } from '@cta/api/back-tests';

// noinspection ES6PreferShortImport
import { environment } from '../environments/environment';
import { AppController } from './app.controller';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: environment.pgHost,
      port: parseInt(environment.pgPort),
      username: environment.pgUser,
      password: environment.pgPassword,
      logging: true,
      autoLoadEntities: true,
      synchronize: true,
    }),
    BullModule.forRoot({
      redis: {
        host: environment.redisHost,
        port: parseInt(environment.redisPort),
        password: environment.redisPassword
      },
    }),
    ApiAuthModule,
    ApiAgentsModule,
    ApiBackTestsModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
