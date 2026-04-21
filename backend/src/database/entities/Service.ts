import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { Equipment } from "./Equipment";

@Index("service_pkey", ["serviceId"], { unique: true })
@Entity("service")
export class Service {
  @Column("date", { name: "service_date" })
  serviceDate: string;

  @Column("uuid", {
    primary: true,
    name: "service_id",
    default: () => "gen_random_uuid()",
  })
  serviceId: string;

  @Column("character varying", { name: "description", length: 1023 })
  description: string;

  @ManyToOne(() => Equipment, (equipment) => equipment.services)
  @JoinColumn([{ name: "equipment_id", referencedColumnName: "equipmentId" }])
  equipment: Equipment;
}
