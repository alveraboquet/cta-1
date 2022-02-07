import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { BackTestConfigurationDto } from '@cta/shared/dtos';
import { BackTestEntity } from '../back-test.entity';
import { BackTestConfigurationsService } from './back-test-configurations.service';
import { BackTestConfigurationEntity } from './back-test-configuration.entity';


@Controller('back-tests/configuration')
export class BackTestConfigurationsController {
  constructor(
    private readonly backTestConfigurationsService: BackTestConfigurationsService
  ) {}

  @UseGuards(AuthGuard('firebase-jwt'))
  @Post('/:id')
  updateConfiguration(@Param('id') id: string, @Body() backTestConfigurationDto: BackTestConfigurationDto) {
    const backTestConfiguration = new BackTestConfigurationEntity(backTestConfigurationDto);
    backTestConfiguration.backTest = new BackTestEntity({ id });
    return this.backTestConfigurationsService.save(backTestConfiguration);
  }

  @UseGuards(AuthGuard('firebase-jwt'))
  @Get('/:id')
  findConfiguration(@Param('id') id: string) {
    return this.backTestConfigurationsService.findLatest(id);
  }

}
