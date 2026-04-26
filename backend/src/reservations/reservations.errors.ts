import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';

export const ReservationsErrors = {
  trainingNotFound: () => new NotFoundException('Trening nije pronađen'),
  memberNotFound: () => new BadRequestException('Član ne postoji'),
  trainingFull: () => new ConflictException('Trening je popunjen'),
  reservationExists: () =>
    new ConflictException('Već imate rezervaciju za ovaj termin'),
  reservationOverlap: () =>
    new ConflictException('Imate drugu rezervaciju u istom terminu'),
  membershipInactive: () => new ConflictException('Nemate važeću članarinu'),
  reservationTooLateToCancel: () =>
    new ConflictException('Rezervacija se ne može otkazati nakon početka treninga'),
  reservationNotFound: () => new NotFoundException('Rezervacija nije pronađena'),
};
