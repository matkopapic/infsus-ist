import { Injectable } from '@nestjs/common';
import { currentDateString } from '../common/utils/current-date-string';
import { CreateMembershipDto } from './dto/create-membership.dto';
import { ListMembershipsQueryDto } from './dto/list-memberships-query.dto';
import { UpdateMembershipDto } from './dto/update-membership.dto';
import { MembershipsErrors } from './memberships.errors';
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
      throw MembershipsErrors.membershipNotFound();
    }

    return membership;
  }

  async create(body: CreateMembershipDto) {
    const existingMembership = await this.membershipsRepository.findByName(body.name);

    if (existingMembership) {
      throw MembershipsErrors.membershipNameExists();
    }

    const membership = this.membershipsRepository.create(body);
    return this.membershipsRepository.save(membership);
  }

  async update(id: string, body: UpdateMembershipDto) {
    const membership = await this.findOne(id);

    if (body.name) {
      const existingMembership = await this.membershipsRepository.findByName(body.name);

      if (existingMembership && existingMembership.membershipId !== id) {
        throw MembershipsErrors.membershipNameExists();
      }
    }

    this.membershipsRepository.merge(membership, body);
    return this.membershipsRepository.save(membership);
  }

  async remove(id: string) {
    await this.findOne(id);

    const usageCount = await this.membershipsRepository.countActiveUsages(
      id,
      currentDateString(),
    );

    if (usageCount > 0) {
      throw MembershipsErrors.membershipInUse();
    }

    await this.membershipsRepository.deleteById(id);
  }
}
