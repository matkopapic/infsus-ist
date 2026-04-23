import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reservation } from '../database/entities/Reservation';
import { Training } from '../database/entities/Training';
import { ListTrainingsQueryDto } from './dto/list-trainings-query.dto';

@Injectable()
export class TrainingsRepository {
  constructor(
    @InjectRepository(Training)
    private readonly trainingsRepository: Repository<Training>,
    @InjectRepository(Reservation)
    private readonly reservationsRepository: Repository<Reservation>,
  ) {}

  async findPaged(query: ListTrainingsQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 25;

    const queryBuilder = this.trainingsRepository
      .createQueryBuilder('training')
      .leftJoinAndSelect('training.trainer', 'trainer')
      .leftJoinAndSelect('trainer.user', 'trainerUser')
      .leftJoinAndSelect('training.reservations', 'reservation');

    if (query.search) {
      queryBuilder.andWhere('training.name ILIKE :search', {
        search: `%${query.search}%`,
      });
    }

    if (query.trainerId) {
      queryBuilder.andWhere('trainer.trainerId = :trainerId', {
        trainerId: query.trainerId,
      });
    }

    if (query.fromDate) {
      queryBuilder.andWhere('training.trainingTime >= :fromDate', {
        fromDate: query.fromDate,
      });
    }

    if (query.toDate) {
      queryBuilder.andWhere('training.trainingTime <= :toDate', {
        toDate: query.toDate,
      });
    }

    queryBuilder
      .orderBy('training.trainingTime', 'ASC')
      .skip((page - 1) * limit)
      .take(limit);

    const [data, total] = await queryBuilder.getManyAndCount();
    return { data, total };
  }

  findByIdWithRelations(trainingId: string) {
    return this.trainingsRepository.findOne({
      where: { trainingId },
      relations: {
        reservations: true,
        trainer: {
          user: true,
        },
      },
    });
  }

  findByIdForUpdate(trainingId: string) {
    return this.trainingsRepository.findOne({
      where: { trainingId },
      relations: { trainer: true },
    });
  }

  create(data: Partial<Training>) {
    return this.trainingsRepository.create(data);
  }

  save(training: Training) {
    return this.trainingsRepository.save(training);
  }

  async countReservations(trainingId: string) {
    return this.reservationsRepository.count({
      where: {
        training: {
          trainingId,
        },
      },
    });
  }

  async hasTrainerOverlap(
    trainerId: string,
    trainingTime: Date,
    durationInMinutes: number,
    excludedTrainingId?: string,
  ) {
    const queryBuilder = this.trainingsRepository
      .createQueryBuilder('training')
      .innerJoin('training.trainer', 'trainer')
      .where('trainer.trainer_id = :trainerId', { trainerId })
      .andWhere(
        `training.training_time < (:trainingTime + make_interval(mins => :durationInMinutes))
         AND (training.training_time + make_interval(mins => training.duration_in_minutes)) > :trainingTime`,
        {
          trainingTime,
          durationInMinutes,
        },
      );

    if (excludedTrainingId) {
      queryBuilder.andWhere('training.training_id != :excludedTrainingId', {
        excludedTrainingId,
      });
    }

    return queryBuilder.getExists();
  }

  deleteById(trainingId: string) {
    return this.trainingsRepository.delete(trainingId);
  }
}
