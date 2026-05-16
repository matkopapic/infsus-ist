import { Column, Entity, Index, OneToMany, OneToOne } from "typeorm";
import { Administrator } from "./Administrator";
import { GymMember } from "./GymMember";
import { Payment } from "./Payment";
import { Trainer } from "./Trainer";

@Index("app_user_email_key", ["email"], { unique: true })
@Index("app_user_pkey", ["userId"], { unique: true })
@Entity("app_user")
export class AppUser {
  @Column("character varying", { name: "name", length: 255 })
  name: string;

  @Column("date", { name: "date_of_birth" })
  dateOfBirth: string;

  @Column("uuid", {
    primary: true,
    name: "user_id",
    default: () => "gen_random_uuid()",
  })
  userId: string;

  @Column("character varying", { name: "email", unique: true, length: 255 })
  email: string;

  @Column("timestamp with time zone", { name: "created_at" })
  createdAt: Date;

  @OneToOne(() => Administrator, (administrator) => administrator.admin)
  administrator: Administrator;

  @OneToOne(() => GymMember, (gymMember) => gymMember.member)
  gymMember: GymMember;

  @OneToMany(() => Payment, (payment) => payment.user)
  payments: Payment[];

  @OneToOne(() => Trainer, (trainer) => trainer.user)
  trainer: Trainer;
}
