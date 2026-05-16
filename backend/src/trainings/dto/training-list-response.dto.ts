import { ApiProperty } from '@nestjs/swagger';
import { TrainingResponseDto } from './training-response.dto';

export class TrainingListResponseDto {
  @ApiProperty({ type: () => [TrainingResponseDto] })
  data: TrainingResponseDto[];

  @ApiProperty({ example: 12 })
  total: number;
}
