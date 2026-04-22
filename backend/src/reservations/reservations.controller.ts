import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { CreateReservationDto } from './dto/create-reservation.dto';

@Controller('trainings/:trainingId/reservations')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Get()
  findAll(@Param('trainingId', new ParseUUIDPipe()) trainingId: string) {
    return this.reservationsService.findAll(trainingId);
  }

  @Post()
  create(
    @Param('trainingId', new ParseUUIDPipe()) trainingId: string,
    @Body() body: CreateReservationDto,
  ) {
    return this.reservationsService.create(trainingId, body);
  }

  @Delete(':reservationId')
  @HttpCode(204)
  remove(
    @Param('trainingId', new ParseUUIDPipe()) trainingId: string,
    @Param('reservationId', new ParseUUIDPipe()) reservationId: string,
  ) {
    return this.reservationsService.remove(trainingId, reservationId);
  }
}
