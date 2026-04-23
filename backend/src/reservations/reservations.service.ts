import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { currentDateString } from '../common/utils/current-date-string';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { ReservationsRepository } from './reservations.repository';

@Injectable()
export class ReservationsService {
  constructor(private readonly reservationsRepository: ReservationsRepository) {}

  async findAll(trainingId: string) {
    await this.assertTrainingExists(trainingId);
    return this.reservationsRepository.findAllByTrainingId(trainingId);
  }

  async create(trainingId: string, body: CreateReservationDto) {
    const training = await this.assertTrainingExists(trainingId);
    const member = await this.reservationsRepository.findMemberById(body.memberId);

    if (!member) {
      throw new BadRequestException('Član ne postoji');
    }

    const reservationCount = await this.reservationsRepository.countByTrainingId(
      trainingId,
    );

    if (reservationCount >= training.capacity) {
      throw new ConflictException('Trening je popunjen');
    }

    const existingReservation = await this.reservationsRepository.findExistingForTrainingAndMember(
      trainingId,
      body.memberId,
    );

    if (existingReservation) {
      throw new ConflictException('Već imate rezervaciju za ovaj termin');
    }

    const hasOverlap = await this.reservationsRepository.hasOverlappingReservation(
      body.memberId,
      trainingId,
      training.trainingTime,
      training.durationInMinutes,
    );

    if (hasOverlap) {
      throw new ConflictException('Imate drugu rezervaciju u istom terminu');
    }

    const hasActiveMembership = await this.reservationsRepository.hasActiveMembership(
      body.memberId,
      currentDateString(),
    );

    if (!hasActiveMembership) {
      throw new ConflictException('Nemate važeću članarinu');
    }

    const reservation = this.reservationsRepository.create({
      member,
      training,
    });

    return this.reservationsRepository.save(reservation);
  }

  async remove(trainingId: string, reservationId: string) {
    const training = await this.assertTrainingExists(trainingId);

    if (training.trainingTime <= new Date()) {
      throw new ConflictException('Rezervacija se ne može otkazati nakon početka treninga');
    }

    const reservation = await this.reservationsRepository.findByIdForTraining(
      trainingId,
      reservationId,
    );

    if (!reservation) {
      throw new NotFoundException('Rezervacija nije pronađena');
    }

    await this.reservationsRepository.deleteById(reservationId);
  }

  private async assertTrainingExists(trainingId: string) {
    const training = await this.reservationsRepository.findTrainingById(trainingId);

    if (!training) {
      throw new NotFoundException('Trening nije pronađen');
    }

    return training;
  }
}
