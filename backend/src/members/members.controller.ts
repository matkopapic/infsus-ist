import { Controller, Get, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { MembersService } from './members.service';
import { ListMembersQueryDto } from './dto/list-members-query.dto';
import { MemberOptionResponseDto } from './dto/member-option-response.dto';
import { MembersMapper } from './members.mapper';

@ApiTags('Members')
@Controller('members')
export class MembersController {
  constructor(
    private readonly membersService: MembersService,
    private readonly membersMapper: MembersMapper,
  ) {}

  @Get()
  @ApiOperation({ summary: 'List members for dropdown options' })
  @ApiOkResponse({ type: MemberOptionResponseDto, isArray: true })
  async findAll(@Query() query: ListMembersQueryDto) {
    const members = await this.membersService.findAll(query);
    return this.membersMapper.toListResponseDto(members);
  }
}
