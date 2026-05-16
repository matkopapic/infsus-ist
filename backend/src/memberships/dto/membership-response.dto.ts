import { ApiProperty } from '@nestjs/swagger';

export class MembershipResponseDto {
  @ApiProperty({ example: '3fa85f64-5717-4562-b3fc-2c963f66afa6' })
  membershipId: string;

  @ApiProperty({ example: 'Standard 1 month' })
  name: string;

  @ApiProperty({ example: '30 days' })
  duration: string;

  @ApiProperty({ example: 30 })
  price: number;
}
