import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { numericTransformer } from "../../common/database/numeric.transformer";
import { MemberMembership } from "./MemberMembership";
import { AppUser } from "./AppUser";

@Index("payment_pkey", ["paymentId"], { unique: true })
@Entity("payment")
export class Payment {
  @Column("timestamp with time zone", { name: "created_at" })
  createdAt: Date;

  @Column("character varying", { name: "status", length: 32 })
  status: string;

  @Column("uuid", {
    primary: true,
    name: "payment_id",
    default: () => "gen_random_uuid()",
  })
  paymentId: string;

  @Column("numeric", {
    name: "amount",
    precision: 10,
    scale: 2,
    transformer: numericTransformer,
  })
  amount: number;

  @OneToMany(
    () => MemberMembership,
    (memberMembership) => memberMembership.payment
  )
  memberMemberships: MemberMembership[];

  @ManyToOne(() => AppUser, (appUser) => appUser.payments)
  @JoinColumn([{ name: "user_id", referencedColumnName: "userId" }])
  user: AppUser;
}
