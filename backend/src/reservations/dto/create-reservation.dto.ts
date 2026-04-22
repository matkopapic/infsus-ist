import { IsUUID } from 'class-validator';

export class CreateReservationDto {
  @IsUUID()
  memberId: string;
}
