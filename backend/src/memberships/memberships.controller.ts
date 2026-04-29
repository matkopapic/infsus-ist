import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { ApiErrorResponseDto } from '../common/dto/api-error-response.dto';
import { MembershipsService } from './memberships.service';
import { CreateMembershipDto } from './dto/create-membership.dto';
import { ListMembershipsQueryDto } from './dto/list-memberships-query.dto';
import { MembershipListResponseDto } from './dto/membership-list-response.dto';
import { MembershipResponseDto } from './dto/membership-response.dto';
import { UpdateMembershipDto } from './dto/update-membership.dto';
import { MembershipsMapper } from './memberships.mapper';

@ApiTags('Memberships')
@Controller('memberships')
export class MembershipsController {
  constructor(
    private readonly membershipsService: MembershipsService,
    private readonly membershipsMapper: MembershipsMapper,
  ) {}

  @Get()
  @ApiOperation({ summary: 'List memberships' })
  @ApiOkResponse({ type: MembershipListResponseDto })
  @ApiBadRequestResponse({ type: ApiErrorResponseDto })
  async findAll(@Query() query: ListMembershipsQueryDto) {
    const result = await this.membershipsService.findAll(query);
    return this.membershipsMapper.toListResponseDto(result.data, result.total);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get membership by id' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiOkResponse({ type: MembershipResponseDto })
  @ApiBadRequestResponse({ type: ApiErrorResponseDto })
  @ApiNotFoundResponse({ type: ApiErrorResponseDto })
  async findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    const membership = await this.membershipsService.findOne(id);
    return this.membershipsMapper.toResponseDto(membership);
  }

  @Post()
  @ApiOperation({ summary: 'Create membership' })
  @ApiCreatedResponse({ type: MembershipResponseDto })
  @ApiBadRequestResponse({ type: ApiErrorResponseDto })
  @ApiConflictResponse({ type: ApiErrorResponseDto })
  async create(@Body() body: CreateMembershipDto) {
    const membership = await this.membershipsService.create(body);
    return this.membershipsMapper.toResponseDto(membership);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update membership' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiOkResponse({ type: MembershipResponseDto })
  @ApiBadRequestResponse({ type: ApiErrorResponseDto })
  @ApiNotFoundResponse({ type: ApiErrorResponseDto })
  @ApiConflictResponse({ type: ApiErrorResponseDto })
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() body: UpdateMembershipDto,
  ) {
    const membership = await this.membershipsService.update(id, body);
    return this.membershipsMapper.toResponseDto(membership);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Delete membership' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiNoContentResponse({ description: 'Membership deleted.' })
  @ApiBadRequestResponse({ type: ApiErrorResponseDto })
  @ApiNotFoundResponse({ type: ApiErrorResponseDto })
  @ApiConflictResponse({ type: ApiErrorResponseDto })
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.membershipsService.remove(id);
  }
}
