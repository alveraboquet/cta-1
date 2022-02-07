import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BackTestConfigurationEntity } from './back-test-configuration.entity';
import { BackTestConfigurationsController } from './back-test-configurations.controller';
import { BackTestConfigurationsService } from './back-test-configurations.service';

@Module({
  imports: [TypeOrmModule.forFeature([BackTestConfigurationEntity])],
  controllers: [BackTestConfigurationsController],
  providers: [BackTestConfigurationsService],
  exports: [BackTestConfigurationsService]
})
export class BackTestConfigurationsModule {}
