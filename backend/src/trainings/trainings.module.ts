import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reservation } from '../database/entities/Reservation';
import { Trainer } from '../database/entities/Trainer';
import { Training } from '../database/entities/Training';
import { TrainingsController } from './trainings.controller';
import { TrainingsRepository } from './trainings.repository';
import { TrainingsService } from './trainings.service';

@Module({
  imports: [TypeOrmModule.forFeature([Training, Trainer, Reservation])],
  controllers: [TrainingsController],
  providers: [TrainingsService, TrainingsRepository],
})
export class TrainingsModule {}
