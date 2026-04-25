import { ApiProperty } from '@nestjs/swagger';
import { ReservationResponseDto } from './reservation-response.dto';

export class ReservationListResponseDto {
  @ApiProperty({ type: () => [ReservationResponseDto] })
  data: ReservationResponseDto[];

  @ApiProperty({ example: 7 })
  total: number;
}
