import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppUser } from '../database/entities/AppUser';
import { GymMember } from '../database/entities/GymMember';
import { MembersController } from './members.controller';
import { MembersMapper } from './members.mapper';
import { MembersRepository } from './members.repository';
import { MembersService } from './members.service';

@Module({
  imports: [TypeOrmModule.forFeature([GymMember, AppUser])],
  controllers: [MembersController],
  providers: [MembersService, MembersRepository, MembersMapper],
})
export class MembersModule {}
