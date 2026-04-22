import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { currentDateKey } from '../common/utils/current-date-key';
import { CreateMembershipDto } from './dto/create-membership.dto';
import { ListMembershipsQueryDto } from './dto/list-memberships-query.dto';
import { UpdateMembershipDto } from './dto/update-membership.dto';
import { MembershipsRepository } from './memberships.repository';

@Injectable()
export class MembershipsService {
  constructor(private readonly membershipsRepository: MembershipsRepository) {}

  findAll(query: ListMembershipsQueryDto) {
    return this.membershipsRepository.findPaged(query);
  }

  async findOne(id: string) {
    const membership = await this.membershipsRepository.findById(id);

    if (!membership) {
      throw new NotFoundException('Članstvo nije pronađeno');
    }

    return membership;
  }

  async create(body: CreateMembershipDto) {
    const existingMembership = await this.membershipsRepository.findByName(body.name);

    if (existingMembership) {
      throw new ConflictException('Članstvo s tim nazivom već postoji');
    }

    const membership = this.membershipsRepository.create(body);
    return this.membershipsRepository.save(membership);
  }

  async update(id: string, body: UpdateMembershipDto) {
    const membership = await this.findOne(id);

    if (body.name) {
      const existingMembership = await this.membershipsRepository.findByName(body.name);

      if (existingMembership && existingMembership.membershipId !== id) {
        throw new ConflictException('Članstvo s tim nazivom već postoji');
      }
    }

    this.membershipsRepository.merge(membership, body);
    return this.membershipsRepository.save(membership);
  }

  async remove(id: string) {
    await this.findOne(id);

    const usageCount = await this.membershipsRepository.countActiveUsages(
      id,
      currentDateKey(),
    );

    if (usageCount > 0) {
      throw new ConflictException('Članstvo se koristi i ne može se obrisati');
    }

    await this.membershipsRepository.deleteById(id);
  }
}
