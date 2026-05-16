import { Type } from 'class-transformer';
import { IsISO8601, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';

export class ListTrainingsQueryDto extends PaginationQueryDto {
  @IsOptional()
  @IsString()
  @MaxLength(255)
  search?: string;

  @IsOptional()
  @IsUUID()
  trainerId?: string;

  @IsOptional()
  @Type(() => String)
  @IsISO8601()
  fromDate?: string;

  @IsOptional()
  @Type(() => String)
  @IsISO8601()
  toDate?: string;
}
