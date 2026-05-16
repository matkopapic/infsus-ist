import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Trainer } from '../database/entities/Trainer';

@Injectable()
export class TrainersRepository {
  constructor(
    @InjectRepository(Trainer)
    private readonly trainersRepository: Repository<Trainer>,
  ) {}

  async findDropdownOptions() {
    const trainers = await this.trainersRepository.find({
      relations: {
        user: true,
      },
      order: {
        user: {
          name: 'ASC',
        },
      },
    });

    return trainers.map((trainer) => ({
      trainerId: trainer.trainerId,
      name: trainer.user.name,
    }));
  }
}
