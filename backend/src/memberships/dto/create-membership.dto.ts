import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString, MaxLength, Min } from 'class-validator';

export class CreateMembershipDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @IsString()
  @IsNotEmpty()
  duration: string;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  price: number;
}
