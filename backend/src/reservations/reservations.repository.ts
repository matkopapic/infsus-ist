import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GymMember } from '../database/entities/GymMember';
import { MemberMembership } from '../database/entities/MemberMembership';
import { Reservation } from '../database/entities/Reservation';
import { Training } from '../database/entities/Training';

@Injectable()
export class ReservationsRepository {
  constructor(
    @InjectRepository(Reservation)
    private readonly reservationsRepository: Repository<Reservation>,
    @InjectRepository(Training)
    private readonly trainingsRepository: Repository<Training>,
    @InjectRepository(GymMember)
    private readonly membersRepository: Repository<GymMember>,
    @InjectRepository(MemberMembership)
    private readonly memberMembershipsRepository: Repository<MemberMembership>,
  ) {}

  async findAllByTrainingId(trainingId: string) {
    const reservations = await this.reservationsRepository.find({
      where: {
        training: {
          trainingId,
        },
      },
      relations: {
        member: {
          member: true,
        },
      },
      order: {
        reservationId: 'ASC',
      },
    });

    return {
      data: reservations,
      total: reservations.length,
    };
  }

  findTrainingById(trainingId: string) {
    return this.trainingsRepository.findOne({
      where: { trainingId },
      relations: {
        trainer: true,
      },
    });
  }

  findMemberById(memberId: string) {
    return this.membersRepository.findOneBy({ memberId });
  }

  create(data: Partial<Reservation>) {
    return this.reservationsRepository.create(data);
  }

  save(reservation: Reservation) {
    return this.reservationsRepository.save(reservation);
  }

  countByTrainingId(trainingId: string) {
    return this.reservationsRepository.count({
      where: {
        training: {
          trainingId,
        },
      },
    });
  }

  findExistingForTrainingAndMember(trainingId: string, memberId: string) {
    return this.reservationsRepository.findOne({
      where: {
        member: {
          memberId,
        },
        training: {
          trainingId,
        },
      },
    });
  }

  async hasOverlappingReservation(
    memberId: string,
    trainingId: string,
    trainingTime: Date,
    duration: string,
  ) {
    return this.reservationsRepository
      .createQueryBuilder('reservation')
      .innerJoin('reservation.training', 'training')
      .innerJoin('reservation.member', 'member')
      .where('member.member_id = :memberId', { memberId })
      .andWhere('training.training_id != :trainingId', { trainingId })
      .andWhere(
        `training.training_time < (:trainingTime::timestamp + CAST(:duration AS interval))
         AND (training.training_time + training.duration) > :trainingTime`,
        {
          trainingTime,
          duration,
        },
      )
      .getExists();
  }

  async hasActiveMembership(memberId: string, currentDateKey: number) {
    return this.memberMembershipsRepository
      .createQueryBuilder('memberMembership')
      .innerJoin('memberMembership.member', 'member')
      .innerJoin('memberMembership.payment', 'payment')
      .where('member.member_id = :memberId', { memberId })
      .andWhere('memberMembership.start_date <= :currentDateKey', {
        currentDateKey,
      })
      .andWhere('memberMembership.end_date >= :currentDateKey', {
        currentDateKey,
      })
      .andWhere('memberMembership.status = :activeStatus', { activeStatus: 1 })
      .andWhere('LOWER(payment.status) = :paidStatus', { paidStatus: 'paid' })
      .getExists();
  }

  findByIdForTraining(trainingId: string, reservationId: string) {
    return this.reservationsRepository.findOne({
      where: {
        reservationId,
        training: {
          trainingId,
        },
      },
    });
  }

  deleteById(reservationId: string) {
    return this.reservationsRepository.delete(reservationId);
  }
}
