import { IsOptional, IsString, MaxLength } from 'class-validator';

export class ListMembersQueryDto {
  @IsOptional()
  @IsString()
  @MaxLength(255)
  search?: string;
}
