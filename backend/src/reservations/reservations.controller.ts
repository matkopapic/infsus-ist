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
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { ApiErrorResponseDto } from '../common/dto/api-error-response.dto';
import { ReservationsService } from './reservations.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { ReservationListResponseDto } from './dto/reservation-list-response.dto';
import { ReservationResponseDto } from './dto/reservation-response.dto';

@ApiTags('Reservations')
@Controller('trainings/:trainingId/reservations')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Get()
  @ApiOperation({ summary: 'List reservations for a training' })
  @ApiParam({ name: 'trainingId', format: 'uuid' })
  @ApiOkResponse({ type: ReservationListResponseDto })
  @ApiBadRequestResponse({ type: ApiErrorResponseDto })
  @ApiNotFoundResponse({ type: ApiErrorResponseDto })
  findAll(@Param('trainingId', new ParseUUIDPipe()) trainingId: string) {
    return this.reservationsService.findAll(trainingId);
  }

  @Post()
  @ApiOperation({ summary: 'Create reservation for a training' })
  @ApiParam({ name: 'trainingId', format: 'uuid' })
  @ApiCreatedResponse({ type: ReservationResponseDto })
  @ApiBadRequestResponse({ type: ApiErrorResponseDto })
  @ApiNotFoundResponse({ type: ApiErrorResponseDto })
  @ApiConflictResponse({ type: ApiErrorResponseDto })
  create(
    @Param('trainingId', new ParseUUIDPipe()) trainingId: string,
    @Body() body: CreateReservationDto,
  ) {
    return this.reservationsService.create(trainingId, body);
  }

  @Delete(':reservationId')
  @HttpCode(204)
  @ApiOperation({ summary: 'Delete reservation for a training' })
  @ApiParam({ name: 'trainingId', format: 'uuid' })
  @ApiParam({ name: 'reservationId', format: 'uuid' })
  @ApiNoContentResponse({ description: 'Reservation deleted.' })
  @ApiBadRequestResponse({ type: ApiErrorResponseDto })
  @ApiNotFoundResponse({ type: ApiErrorResponseDto })
  @ApiConflictResponse({ type: ApiErrorResponseDto })
  remove(
    @Param('trainingId', new ParseUUIDPipe()) trainingId: string,
    @Param('reservationId', new ParseUUIDPipe()) reservationId: string,
  ) {
    return this.reservationsService.remove(trainingId, reservationId);
  }
}
