import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BackTestConfigurationsModule } from './back-test-configurations/back-test-configurations.module';
import { BackTestExecutionsModule } from './back-test-executions/back-test-executions.module';
import { BackTestsController } from './back-tests.controller';
import { BackTestsService } from './back-tests.service';
import { BackTestEntity } from './back-test.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([BackTestEntity]),
    BackTestConfigurationsModule,
    BackTestExecutionsModule,
  ],
  controllers: [BackTestsController],
  providers: [BackTestsService],
  exports: [BackTestsService],
})
export class ApiBackTestsModule {}
