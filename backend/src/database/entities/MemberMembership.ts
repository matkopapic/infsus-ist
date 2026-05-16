import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { Membership } from "./Membership";
import { GymMember } from "./GymMember";
import { Payment } from "./Payment";

@Index("member_membership_pkey", ["ownershipId"], { unique: true })
@Entity("member_membership")
export class MemberMembership {
  @Column("integer", { name: "status" })
  status: number;

  @Column("date", { name: "start_date" })
  startDate: string;

  @Column("date", { name: "end_date" })
  endDate: string;

  @Column("uuid", {
    primary: true,
    name: "ownership_id",
    default: () => "gen_random_uuid()",
  })
  ownershipId: string;

  @ManyToOne(() => Membership, (membership) => membership.memberMemberships)
  @JoinColumn([{ name: "membership_id", referencedColumnName: "membershipId" }])
  membership: Membership;

  @ManyToOne(() => GymMember, (gymMember) => gymMember.memberMemberships)
  @JoinColumn([{ name: "member_id", referencedColumnName: "memberId" }])
  member: GymMember;

  @ManyToOne(() => Payment, (payment) => payment.memberMemberships)
  @JoinColumn([{ name: "payment_id", referencedColumnName: "paymentId" }])
  payment: Payment;
}
