import { ApiProperty } from '@nestjs/swagger';
import { ReservationMemberResponseDto } from './reservation-member-response.dto';

export class ReservationResponseDto {
  @ApiProperty({ example: '3fa85f64-5717-4562-b3fc-2c963f66afa6' })
  reservationId: string;

  @ApiProperty({ example: '2026-06-10T09:30:00Z' })
  createdAt: string;

  @ApiProperty({ type: () => ReservationMemberResponseDto })
  member: ReservationMemberResponseDto;
}
