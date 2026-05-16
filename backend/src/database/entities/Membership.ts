import {
  Column,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  OneToMany,
} from "typeorm";
import { MemberMembership } from "./MemberMembership";
import { Perk } from "./Perk";

@Index("membership_pkey", ["membershipId"], { unique: true })
@Entity("membership")
export class Membership {
  @Column("uuid", {
    primary: true,
    name: "membership_id",
    default: () => "gen_random_uuid()",
  })
  membershipId: string;

  @Column("character varying", { name: "name", length: 255 })
  name: string;

  @Column("interval", { name: "duration" })
  duration: any;

  @Column("double precision", { name: "price", precision: 53 })
  price: number;

  @OneToMany(
    () => MemberMembership,
    (memberMembership) => memberMembership.membership
  )
  memberMemberships: MemberMembership[];

  @ManyToMany(() => Perk, (perk) => perk.memberships)
  @JoinTable({
    name: "membership_perks",
    joinColumns: [
      { name: "membership_id", referencedColumnName: "membershipId" },
    ],
    inverseJoinColumns: [{ name: "perk_id", referencedColumnName: "perkId" }],
    schema: "public",
  })
  perks: Perk[];
}
