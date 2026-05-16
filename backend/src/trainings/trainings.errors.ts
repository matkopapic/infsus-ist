import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';

export const TrainingsErrors = {
  trainingNotFound: () => new NotFoundException('Trening nije pronađen'),
  trainerNotFound: () => new BadRequestException('Trener ne postoji'),
  trainingInPast: () =>
    new ConflictException('Trening se ne može kreirati u prošlosti'),
  trainerOverlap: () =>
    new ConflictException('Trener već ima trening u tom terminu'),
  trainingCapacityTooSmall: () =>
    new ConflictException(
      'Kapacitet ne može biti manji od broja postojećih rezervacija',
    ),
  trainingHasReservations: () => new ConflictException('Trening ima rezervacije'),
};
