import { Controller, Get, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { MembersService } from './members.service';
import { ListMembersQueryDto } from './dto/list-members-query.dto';
import { MemberOptionResponseDto } from './dto/member-option-response.dto';

@ApiTags('Members')
@Controller('members')
export class MembersController {
  constructor(private readonly membersService: MembersService) {}

  @Get()
  @ApiOperation({ summary: 'List members for dropdown options' })
  @ApiOkResponse({ type: MemberOptionResponseDto, isArray: true })
  findAll(@Query() query: ListMembersQueryDto) {
    return this.membersService.findAll(query);
  }
}
