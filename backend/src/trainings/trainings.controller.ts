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
import { TrainingsService } from './trainings.service';
import { CreateTrainingDto } from './dto/create-training.dto';
import { ListTrainingsQueryDto } from './dto/list-trainings-query.dto';
import { UpdateTrainingDto } from './dto/update-training.dto';

@Controller('trainings')
export class TrainingsController {
  constructor(private readonly trainingsService: TrainingsService) {}

  @Get()
  findAll(@Query() query: ListTrainingsQueryDto) {
    return this.trainingsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.trainingsService.findOne(id);
  }

  @Post()
  create(@Body() body: CreateTrainingDto) {
    return this.trainingsService.create(body);
  }

  @Put(':id')
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() body: UpdateTrainingDto,
  ) {
    return this.trainingsService.update(id, body);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.trainingsService.remove(id);
  }
}
