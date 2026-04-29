import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Trainer } from '../database/entities/Trainer';
import { CreateTrainingDto } from './dto/create-training.dto';
import { TrainingsErrors } from './trainings.errors';
import { ListTrainingsQueryDto } from './dto/list-trainings-query.dto';
import { UpdateTrainingDto } from './dto/update-training.dto';
import { TrainingsRepository } from './trainings.repository';

@Injectable()
export class TrainingsService {
  constructor(
    private readonly trainingsRepository: TrainingsRepository,
    @InjectRepository(Trainer)
    private readonly trainersRepository: Repository<Trainer>,
  ) {}

  async findAll(query: ListTrainingsQueryDto) {
    const { data, total } = await this.trainingsRepository.findPaged(query);

    return {
      data: data.map((training) => ({
        ...training,
        availableSlots: training.capacity - training.reservations.length,
      })),
      total,
    };
  }

  async findOne(id: string) {
    const training = await this.trainingsRepository.findByIdWithRelations(id);

    if (!training) {
      throw TrainingsErrors.trainingNotFound();
    }

    return {
      ...training,
      availableSlots: training.capacity - training.reservations.length,
    };
  }

  async create(body: CreateTrainingDto) {
    const trainer = await this.trainersRepository.findOneBy({
      trainerId: body.trainerId,
    });

    if (!trainer) {
      throw TrainingsErrors.trainerNotFound();
    }

    const trainingTime = new Date(body.trainingTime);

    if (trainingTime <= new Date()) {
      throw TrainingsErrors.trainingInPast();
    }

    const hasOverlap = await this.trainingsRepository.hasTrainerOverlap(
      body.trainerId,
      trainingTime,
      body.durationInMinutes,
    );

    if (hasOverlap) {
      throw TrainingsErrors.trainerOverlap();
    }

    const training = this.trainingsRepository.create({
      capacity: body.capacity,
      durationInMinutes: body.durationInMinutes,
      name: body.name,
      trainingTime,
      trainer,
    });

    const savedTraining = await this.trainingsRepository.save(training);
    return this.findOne(savedTraining.trainingId);
  }

  async update(id: string, body: UpdateTrainingDto) {
    const training = await this.trainingsRepository.findByIdForUpdate(id);

    if (!training) {
      throw TrainingsErrors.trainingNotFound();
    }

    if (body.trainerId) {
      const trainer = await this.trainersRepository.findOneBy({
        trainerId: body.trainerId,
      });

      if (!trainer) {
        throw TrainingsErrors.trainerNotFound();
      }

      training.trainer = trainer;
    }

    const nextTrainingTime = body.trainingTime
      ? new Date(body.trainingTime)
      : training.trainingTime;
    const nextDuration = body.durationInMinutes ?? training.durationInMinutes;
    const nextTrainerId = body.trainerId ?? training.trainer.trainerId;

    if (nextTrainingTime <= new Date()) {
      throw TrainingsErrors.trainingInPast();
    }

    const reservationCount = await this.trainingsRepository.countReservations(id);

    if (body.capacity !== undefined && body.capacity < reservationCount) {
      throw TrainingsErrors.trainingCapacityTooSmall();
    }

    const hasOverlap = await this.trainingsRepository.hasTrainerOverlap(
      nextTrainerId,
      nextTrainingTime,
      nextDuration,
      id,
    );

    if (hasOverlap) {
      throw TrainingsErrors.trainerOverlap();
    }

    if (body.capacity !== undefined) {
      training.capacity = body.capacity;
    }

    if (body.durationInMinutes !== undefined) {
      training.durationInMinutes = body.durationInMinutes;
    }

    if (body.name !== undefined) {
      training.name = body.name;
    }

    if (body.trainingTime !== undefined) {
      training.trainingTime = new Date(body.trainingTime);
    }

    const savedTraining = await this.trainingsRepository.save(training);
    return this.findOne(savedTraining.trainingId);
  }

  async remove(id: string) {
    await this.findOne(id);

    const reservationCount = await this.trainingsRepository.countReservations(id);

    if (reservationCount > 0) {
      throw TrainingsErrors.trainingHasReservations();
    }

    await this.trainingsRepository.deleteById(id);
  }
}
