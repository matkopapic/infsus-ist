import { ApiProperty } from '@nestjs/swagger';

export class TrainerOptionResponseDto {
  @ApiProperty({ example: '3fa85f64-5717-4562-b3fc-2c963f66afa6' })
  trainerId: string;

  @ApiProperty({ example: 'Marko Markovic' })
  name: string;
}
