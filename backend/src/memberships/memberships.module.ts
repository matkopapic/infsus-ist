import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MemberMembership } from '../database/entities/MemberMembership';
import { Membership } from '../database/entities/Membership';
import { MembershipsController } from './memberships.controller';
import { MembershipsMapper } from './memberships.mapper';
import { MembershipsRepository } from './memberships.repository';
import { MembershipsService } from './memberships.service';

@Module({
  imports: [TypeOrmModule.forFeature([Membership, MemberMembership])],
  controllers: [MembershipsController],
  providers: [MembershipsService, MembershipsRepository, MembershipsMapper],
})
export class MembershipsModule {}
