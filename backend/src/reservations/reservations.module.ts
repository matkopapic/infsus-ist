import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GymMember } from '../database/entities/GymMember';
import { MemberMembership } from '../database/entities/MemberMembership';
import { Reservation } from '../database/entities/Reservation';
import { Training } from '../database/entities/Training';
import { ReservationsController } from './reservations.controller';
import { ReservationsRepository } from './reservations.repository';
import { ReservationsService } from './reservations.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Reservation,
      Training,
      GymMember,
      MemberMembership,
    ]),
  ],
  controllers: [ReservationsController],
  providers: [ReservationsService, ReservationsRepository],
})
export class ReservationsModule {}
