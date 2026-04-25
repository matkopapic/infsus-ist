import { ApiProperty } from '@nestjs/swagger';
import { MembershipResponseDto } from './membership-response.dto';

export class MembershipListResponseDto {
  @ApiProperty({ type: () => [MembershipResponseDto] })
  data: MembershipResponseDto[];

  @ApiProperty({ example: 2 })
  total: number;
}
