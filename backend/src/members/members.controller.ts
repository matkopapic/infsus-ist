import { Controller, Get, Query } from '@nestjs/common';
import { MembersService } from './members.service';
import { ListMembersQueryDto } from './dto/list-members-query.dto';

@Controller('members')
export class MembersController {
  constructor(private readonly membersService: MembersService) {}

  @Get()
  findAll(@Query() query: ListMembersQueryDto) {
    return this.membersService.findAll(query);
  }
}
