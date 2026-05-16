import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppUser } from '../database/entities/AppUser';
import { Trainer } from '../database/entities/Trainer';
import { TrainersController } from './trainers.controller';
import { TrainersRepository } from './trainers.repository';
import { TrainersService } from './trainers.service';

@Module({
  imports: [TypeOrmModule.forFeature([Trainer, AppUser])],
  controllers: [TrainersController],
  providers: [TrainersService, TrainersRepository],
})
export class TrainersModule {}
