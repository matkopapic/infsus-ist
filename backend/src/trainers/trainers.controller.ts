import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { TrainersService } from './trainers.service';
import { TrainerOptionResponseDto } from './dto/trainer-option-response.dto';
import { TrainersMapper } from './trainers.mapper';

@ApiTags('Trainers')
@Controller('trainers')
export class TrainersController {
  constructor(
    private readonly trainersService: TrainersService,
    private readonly trainersMapper: TrainersMapper,
  ) {}

  @Get()
  @ApiOperation({ summary: 'List trainers for dropdown options' })
  @ApiOkResponse({ type: TrainerOptionResponseDto, isArray: true })
  async findAll() {
    const trainers = await this.trainersService.findAll();
    return this.trainersMapper.toListResponseDto(trainers);
  }
}
