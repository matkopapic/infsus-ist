import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsNumber, IsString, MaxLength, Min } from 'class-validator';

export class CreateMembershipDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @IsString()
  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  durationInDays: number;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  price: number;
}
