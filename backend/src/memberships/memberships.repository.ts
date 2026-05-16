import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MemberMembership } from '../database/entities/MemberMembership';
import { Membership } from '../database/entities/Membership';
import { CreateMembershipDto } from './dto/create-membership.dto';
import { ListMembershipsQueryDto } from './dto/list-memberships-query.dto';

@Injectable()
export class MembershipsRepository {
  constructor(
    @InjectRepository(Membership)
    private readonly membershipsRepository: Repository<Membership>,
    @InjectRepository(MemberMembership)
    private readonly memberMembershipsRepository: Repository<MemberMembership>,
  ) {}

  async findPaged(query: ListMembershipsQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 25;

    const queryBuilder = this.membershipsRepository.createQueryBuilder('membership');

    if (query.search) {
      queryBuilder.andWhere('membership.name ILIKE :search', {
        search: `%${query.search}%`,
      });
    }

    queryBuilder
      .orderBy('membership.name', 'ASC')
      .skip((page - 1) * limit)
      .take(limit);

    const [data, total] = await queryBuilder.getManyAndCount();
    return { data, total };
  }

  findById(membershipId: string) {
    return this.membershipsRepository.findOneBy({ membershipId });
  }

  findByName(name: string) {
    return this.membershipsRepository.findOneBy({ name });
  }

  create(data: CreateMembershipDto) {
    return this.membershipsRepository.create(data);
  }

  save(membership: Membership) {
    return this.membershipsRepository.save(membership);
  }

  merge(membership: Membership, data: Partial<Membership>) {
    return this.membershipsRepository.merge(membership, data);
  }

  async countActiveUsages(membershipId: string, currentDate: string) {
    return this.memberMembershipsRepository
      .createQueryBuilder('memberMembership')
      .innerJoin('memberMembership.payment', 'payment')
      .where('memberMembership.membership_id = :membershipId', { membershipId })
      .andWhere('memberMembership.start_date <= :currentDate', {
        currentDate,
      })
      .andWhere('memberMembership.end_date >= :currentDate', {
        currentDate,
      })
      .andWhere('memberMembership.status = :activeStatus', { activeStatus: 1 })
      .andWhere('LOWER(payment.status) = :paidStatus', { paidStatus: 'paid' })
      .getCount();
  }

  deleteById(membershipId: string) {
    return this.membershipsRepository.delete(membershipId);
  }
}
