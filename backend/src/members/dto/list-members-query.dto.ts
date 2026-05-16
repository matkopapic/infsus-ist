import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class ListMembersQueryDto {
  @ApiPropertyOptional({ example: 'anna' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  search?: string;
}
