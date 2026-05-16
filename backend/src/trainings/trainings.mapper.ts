import { Injectable } from '@nestjs/common';
import { Training } from '../database/entities/Training';
import { TrainingListResponseDto } from './dto/training-list-response.dto';
import { TrainingResponseDto } from './dto/training-response.dto';

type TrainingWithAvailableSlots = Training & { availableSlots: number };

@Injectable()
export class TrainingsMapper {
  toResponseDto(training: TrainingWithAvailableSlots): TrainingResponseDto {
    return {
      trainingId: training.trainingId,
      name: training.name,
      trainingTime: training.trainingTime.toISOString(),
      durationInMinutes: training.durationInMinutes,
      capacity: training.capacity,
      availableSlots: training.availableSlots,
      trainer: {
        trainerId: training.trainer.trainerId,
        name: training.trainer.user.name,
      },
    };
  }

  toListResponseDto(
    data: TrainingWithAvailableSlots[],
    total: number,
  ): TrainingListResponseDto {
    return {
      data: data.map((training) => this.toResponseDto(training)),
      total,
    };
  }
}
