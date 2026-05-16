import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DataSource } from 'typeorm';
import { AppUser } from './entities/AppUser';

@Injectable()
export class DatabaseService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(AppUser)
    private readonly appUserRepository: Repository<AppUser>,
  ) {}

  async testConnection() {
    const [result] = await this.dataSource.query(
      'SELECT current_database() AS database, current_schema() AS schema, NOW() AS server_time',
    );

    return {
      connected: true,
      ...result,
    };
  }

  getUsers(): Promise<AppUser[]> {
    return this.appUserRepository.find();
  }
}
