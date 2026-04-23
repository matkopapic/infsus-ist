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
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @IsISO8601()
  trainingTime: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  durationInMinutes: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  capacity: number;

  @IsUUID()
  trainerId: string;
}
