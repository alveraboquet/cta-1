import { auth } from 'firebase-admin';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from '@cta/api/auth';
import { BackTestConfigurationDto, BackTestDto } from '@cta/shared/dtos';
import { BackTestsService } from './back-tests.service';
import { BackTestEntity } from './back-test.entity';
import { BackTestExecutionsService } from './back-test-executions/back-test-executions.service';
import { Paginate, Paginated, PaginateQuery } from 'nestjs-paginate';
import { BackTestConfigurationsService } from './back-test-configurations/back-test-configurations.service';

@Controller('back-tests')
export class BackTestsController {
  constructor(
    private readonly backTestsService: BackTestsService,
    private readonly backTestConfigurationsService: BackTestConfigurationsService,
    private readonly backTestsExecutionService: BackTestExecutionsService
  ) {}

  @UseGuards(AuthGuard('firebase-jwt'))
  @Post()
  async create(
    @User() user: auth.DecodedIdToken,
    @Body() backTestDto: BackTestDto
  ): Promise<BackTestEntity> {
    let result;
    const backTest = new BackTestEntity(backTestDto);

    if (!backTest.userId) {
      backTest.userId = user.uid;
    }
    if (backTest.userId === user.uid) {
      result = await this.backTestsService.save(backTest);
    }

    return result;
  }

  @UseGuards(AuthGuard('firebase-jwt'))
  @Get()
  async find(
    @User() user: auth.DecodedIdToken,
    @Paginate() query: PaginateQuery
  ): Promise<Paginated<BackTestEntity>> {
    return await this.backTestsService.find(query, user.uid);
  }

  @UseGuards(AuthGuard('firebase-jwt'))
  @Get(':id')
  async findOne(
    @User() user: auth.DecodedIdToken,
    @Param('id') id: string
  ): Promise<BackTestDto> {
    let result: BackTestDto;

    result = (await this.backTestsService.findOne(
      id,
      user.id
    )) as unknown as BackTestDto;

    result.configuration = (await this.backTestConfigurationsService.findLatest(
      id
    )) as unknown as BackTestConfigurationDto;

    return result;
  }

  @UseGuards(AuthGuard('firebase-jwt'))
  @Delete('/:id')
  async delete(
    @User() user: auth.DecodedIdToken,
    @Param('id') id: string
  ): Promise<BackTestEntity> {
    return await this.backTestsService.delete(id, user.uid);
  }

  @UseGuards(AuthGuard('firebase-jwt'))
  @Post('/run/:id')
  async start(
    @User() user: auth.DecodedIdToken,
    @Param('id') id: string
  ): Promise<void> {
    const backTest = await this.backTestsService.findOne(id, user.id);
    await this.backTestsExecutionService.run(backTest);
  }
}
