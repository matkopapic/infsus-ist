import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GymMember } from '../database/entities/GymMember';
import { ListMembersQueryDto } from './dto/list-members-query.dto';

@Injectable()
export class MembersRepository {
  constructor(
    @InjectRepository(GymMember)
    private readonly membersRepository: Repository<GymMember>,
  ) {}

  async findDropdownOptions(query: ListMembersQueryDto) {
    const queryBuilder = this.membersRepository
      .createQueryBuilder('member')
      .leftJoinAndSelect('member.member', 'user')
      .orderBy('user.name', 'ASC');

    if (query.search) {
      queryBuilder.andWhere('(user.name ILIKE :search OR user.email ILIKE :search)', {
        search: `%${query.search}%`,
      });
    }

    const members = await queryBuilder.getMany();

    return members.map((member) => ({
      memberId: member.memberId,
      name: member.member.name,
      email: member.member.email,
    }));
  }
}
