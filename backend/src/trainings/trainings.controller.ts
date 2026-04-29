import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { ApiErrorResponseDto } from '../common/dto/api-error-response.dto';
import { TrainingsService } from './trainings.service';
import { CreateTrainingDto } from './dto/create-training.dto';
import { ListTrainingsQueryDto } from './dto/list-trainings-query.dto';
import { TrainingListResponseDto } from './dto/training-list-response.dto';
import { TrainingResponseDto } from './dto/training-response.dto';
import { UpdateTrainingDto } from './dto/update-training.dto';
import { TrainingsMapper } from './trainings.mapper';

@ApiTags('Trainings')
@Controller('trainings')
export class TrainingsController {
  constructor(
    private readonly trainingsService: TrainingsService,
    private readonly trainingsMapper: TrainingsMapper,
  ) {}

  @Get()
  @ApiOperation({ summary: 'List trainings' })
  @ApiOkResponse({ type: TrainingListResponseDto })
  @ApiBadRequestResponse({ type: ApiErrorResponseDto })
  async findAll(@Query() query: ListTrainingsQueryDto) {
    const result = await this.trainingsService.findAll(query);
    return this.trainingsMapper.toListResponseDto(result.data, result.total);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get training by id' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiOkResponse({ type: TrainingResponseDto })
  @ApiBadRequestResponse({ type: ApiErrorResponseDto })
  @ApiNotFoundResponse({ type: ApiErrorResponseDto })
  async findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    const training = await this.trainingsService.findOne(id);
    return this.trainingsMapper.toResponseDto(training);
  }

  @Post()
  @ApiOperation({ summary: 'Create training' })
  @ApiCreatedResponse({ type: TrainingResponseDto })
  @ApiBadRequestResponse({ type: ApiErrorResponseDto })
  @ApiConflictResponse({ type: ApiErrorResponseDto })
  async create(@Body() body: CreateTrainingDto) {
    const training = await this.trainingsService.create(body);
    return this.trainingsMapper.toResponseDto(training);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update training' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiOkResponse({ type: TrainingResponseDto })
  @ApiBadRequestResponse({ type: ApiErrorResponseDto })
  @ApiNotFoundResponse({ type: ApiErrorResponseDto })
  @ApiConflictResponse({ type: ApiErrorResponseDto })
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() body: UpdateTrainingDto,
  ) {
    const training = await this.trainingsService.update(id, body);
    return this.trainingsMapper.toResponseDto(training);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Delete training' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiNoContentResponse({ description: 'Training deleted.' })
  @ApiBadRequestResponse({ type: ApiErrorResponseDto })
  @ApiNotFoundResponse({ type: ApiErrorResponseDto })
  @ApiConflictResponse({ type: ApiErrorResponseDto })
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.trainingsService.remove(id);
  }
}
