import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { TrainersService } from './trainers.service';
import { TrainerOptionResponseDto } from './dto/trainer-option-response.dto';

@ApiTags('Trainers')
@Controller('trainers')
export class TrainersController {
  constructor(private readonly trainersService: TrainersService) {}

  @Get()
  @ApiOperation({ summary: 'List trainers for dropdown options' })
  @ApiOkResponse({ type: TrainerOptionResponseDto, isArray: true })
  findAll() {
    return this.trainersService.findAll();
  }
}
