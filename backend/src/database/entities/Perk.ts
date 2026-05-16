import { Column, Entity, Index, ManyToMany } from "typeorm";
import { Membership } from "./Membership";

@Index("perk_pkey", ["perkId"], { unique: true })
@Entity("perk")
export class Perk {
  @Column("character varying", { name: "name", length: 255 })
  name: string;

  @Column("uuid", {
    primary: true,
    name: "perk_id",
    default: () => "gen_random_uuid()",
  })
  perkId: string;

  @ManyToMany(() => Membership, (membership) => membership.perks)
  memberships: Membership[];
}
