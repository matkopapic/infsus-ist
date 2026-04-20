import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class DatabaseService {
  constructor(private readonly dataSource: DataSource) {}

  async testConnection() {
    const [result] = await this.dataSource.query(
      'SELECT current_database() AS database, current_schema() AS schema, NOW() AS server_time',
    );

    return {
      connected: true,
      ...result,
    };
  }

  async getUsers() {
      const result = await this.dataSource.query(
          'SELECT * from app_user',
      );

      return {
          ...result,
      };
  }
}
