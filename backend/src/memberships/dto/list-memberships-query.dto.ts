import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';

export class ListMembershipsQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({ example: 'standard' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  search?: string;
}
