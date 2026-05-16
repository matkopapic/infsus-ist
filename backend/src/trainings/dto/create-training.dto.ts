import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsInt,
  IsISO8601,
  IsNotEmpty,
  IsString,
  IsUUID,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateTrainingDto {
  @ApiProperty({ example: 'Group cardio workout' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @ApiProperty({ example: '2026-06-15T18:00:00Z' })
  @IsISO8601()
  trainingTime: string;

  @ApiProperty({ example: 60, minimum: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  durationInMinutes: number;

  @ApiProperty({ example: 15, minimum: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  capacity: number;

  @ApiProperty({ example: '3fa85f64-5717-4562-b3fc-2c963f66afa6' })
  @IsUUID()
  trainerId: string;
}
