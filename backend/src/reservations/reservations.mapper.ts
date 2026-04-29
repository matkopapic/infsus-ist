import { Injectable } from '@nestjs/common';
import { Reservation } from '../database/entities/Reservation';
import { ReservationListResponseDto } from './dto/reservation-list-response.dto';
import { ReservationResponseDto } from './dto/reservation-response.dto';

@Injectable()
export class ReservationsMapper {
  toResponseDto(reservation: Reservation): ReservationResponseDto {
    return {
      reservationId: reservation.reservationId,
      createdAt: reservation.createdAt.toISOString(),
      member: {
        memberId: reservation.member.memberId,
        name: reservation.member.member.name,
      },
    };
  }

  toListResponseDto(
    data: Reservation[],
    total: number,
  ): ReservationListResponseDto {
    return {
      data: data.map((reservation) => this.toResponseDto(reservation)),
      total,
    };
  }
}
