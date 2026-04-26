import { ConflictException, NotFoundException } from '@nestjs/common';

export const MembershipsErrors = {
  membershipNotFound: () => new NotFoundException('Članstvo nije pronađeno'),
  membershipNameExists: () =>
    new ConflictException('Članstvo s tim nazivom već postoji'),
  membershipInUse: () =>
    new ConflictException('Članstvo se koristi i ne može se obrisati'),
};
