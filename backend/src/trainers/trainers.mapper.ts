import { Injectable } from '@nestjs/common';
import { TrainerOptionResponseDto } from './dto/trainer-option-response.dto';

@Injectable()
export class TrainersMapper {
  toListResponseDto(trainers: TrainerOptionResponseDto[]): TrainerOptionResponseDto[] {
    return trainers;
  }
}
