import { Injectable } from '@nestjs/common';
import { currentDateString } from '../common/utils/current-date-string';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { ReservationsErrors } from './reservations.errors';
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
      throw ReservationsErrors.memberNotFound();
    }

    const reservationCount = await this.reservationsRepository.countByTrainingId(
      trainingId,
    );

    if (reservationCount >= training.capacity) {
      throw ReservationsErrors.trainingFull();
    }

    const existingReservation = await this.reservationsRepository.findExistingForTrainingAndMember(
      trainingId,
      body.memberId,
    );

    if (existingReservation) {
      throw ReservationsErrors.reservationExists();
    }

    const hasOverlap = await this.reservationsRepository.hasOverlappingReservation(
      body.memberId,
      trainingId,
      training.trainingTime,
      training.durationInMinutes,
    );

    if (hasOverlap) {
      throw ReservationsErrors.reservationOverlap();
    }

    const hasActiveMembership = await this.reservationsRepository.hasActiveMembership(
      body.memberId,
      currentDateString(),
    );

    if (!hasActiveMembership) {
      throw ReservationsErrors.membershipInactive();
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
      throw ReservationsErrors.reservationTooLateToCancel();
    }

    const reservation = await this.reservationsRepository.findByIdForTraining(
      trainingId,
      reservationId,
    );

    if (!reservation) {
      throw ReservationsErrors.reservationNotFound();
    }

    await this.reservationsRepository.deleteById(reservationId);
  }

  private async assertTrainingExists(trainingId: string) {
    const training = await this.reservationsRepository.findTrainingById(trainingId);

    if (!training) {
      throw ReservationsErrors.trainingNotFound();
    }

    return training;
  }
}
