import { Injectable } from '@nestjs/common';
import { TrainersRepository } from './trainers.repository';

@Injectable()
export class TrainersService {
  constructor(private readonly trainersRepository: TrainersRepository) {}

  findAll() {
    return this.trainersRepository.findDropdownOptions();
  }
}
