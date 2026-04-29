import { Injectable } from '@nestjs/common';
import { MemberOptionResponseDto } from './dto/member-option-response.dto';

@Injectable()
export class MembersMapper {
  toListResponseDto(members: MemberOptionResponseDto[]): MemberOptionResponseDto[] {
    return members;
  }
}
