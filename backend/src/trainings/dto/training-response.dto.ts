import { ApiProperty } from '@nestjs/swagger';
import { TrainingTrainerResponseDto } from './training-trainer-response.dto';

export class TrainingResponseDto {
  @ApiProperty({ example: '3fa85f64-5717-4562-b3fc-2c963f66afa6' })
  trainingId: string;

  @ApiProperty({ example: 'Group cardio workout' })
  name: string;

  @ApiProperty({ example: '2026-06-15T18:00:00Z' })
  trainingTime: string;

  @ApiProperty({ example: 60 })
  durationInMinutes: number;

  @ApiProperty({ example: 15 })
  capacity: number;

  @ApiProperty({ example: 8 })
  availableSlots: number;

  @ApiProperty({ type: () => TrainingTrainerResponseDto })
  trainer: TrainingTrainerResponseDto;
}
