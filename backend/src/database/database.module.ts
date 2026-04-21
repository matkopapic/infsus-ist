import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseController } from './database.controller';
import { DatabaseService } from './database.service';
import { AppUser } from './entities/AppUser';

@Module({
  imports: [TypeOrmModule.forFeature([AppUser])],
  controllers: [DatabaseController],
  providers: [DatabaseService],
})
export class DatabaseModule {}
