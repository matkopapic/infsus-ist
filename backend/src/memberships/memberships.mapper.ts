import { Injectable } from '@nestjs/common';
import { Membership } from '../database/entities/Membership';
import { MembershipListResponseDto } from './dto/membership-list-response.dto';
import { MembershipResponseDto } from './dto/membership-response.dto';

@Injectable()
export class MembershipsMapper {
  toResponseDto(membership: Membership): MembershipResponseDto {
    return {
      membershipId: membership.membershipId,
      name: membership.name,
      durationInDays: membership.durationInDays,
      price: membership.price,
    };
  }

  toListResponseDto(data: Membership[], total: number): MembershipListResponseDto {
    return {
      data: data.map((membership) => this.toResponseDto(membership)),
      total,
    };
  }
}
