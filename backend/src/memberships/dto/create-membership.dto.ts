import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsNumber, IsString, MaxLength, Min } from 'class-validator';

export class CreateMembershipDto {
  @ApiProperty({ example: 'Standard 1 month' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @ApiProperty({ example: 30, minimum: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  durationInDays: number;

  @ApiProperty({ example: 30.0, minimum: 0.01 })
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  price: number;
}
