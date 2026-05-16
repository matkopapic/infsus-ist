import { Injectable } from '@nestjs/common';
import { ListMembersQueryDto } from './dto/list-members-query.dto';
import { MembersRepository } from './members.repository';

@Injectable()
export class MembersService {
  constructor(private readonly membersRepository: MembersRepository) {}

  findAll(query: ListMembersQueryDto) {
    return this.membersRepository.findDropdownOptions(query);
  }
}
