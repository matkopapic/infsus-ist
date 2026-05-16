import { ApiProperty } from '@nestjs/swagger';

export class ReservationMemberResponseDto {
  @ApiProperty({ example: '3fa85f64-5717-4562-b3fc-2c963f66afa6' })
  memberId: string;

  @ApiProperty({ example: 'Ana Anic' })
  name: string;
}
