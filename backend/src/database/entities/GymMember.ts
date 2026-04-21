import {
  Column,
  Entity,
  Index,
  JoinColumn,
  OneToMany,
  OneToOne,
} from "typeorm";
import { Attendance } from "./Attendance";
import { AppUser } from "./AppUser";
import { MemberMembership } from "./MemberMembership";
import { Reservation } from "./Reservation";

@Index("gym_member_pkey", ["memberId"], { unique: true })
@Entity("gym_member")
export class GymMember {
  @Column("date", { name: "join_date" })
  joinDate: string;

  @Column("uuid", { primary: true, name: "member_id" })
  memberId: string;

  @OneToMany(() => Attendance, (attendance) => attendance.member)
  attendances: Attendance[];

  @OneToOne(() => AppUser, (appUser) => appUser.gymMember)
  @JoinColumn([{ name: "member_id", referencedColumnName: "userId" }])
  member: AppUser;

  @OneToMany(
    () => MemberMembership,
    (memberMembership) => memberMembership.member
  )
  memberMemberships: MemberMembership[];

  @OneToMany(() => Reservation, (reservation) => reservation.member)
  reservations: Reservation[];
}
