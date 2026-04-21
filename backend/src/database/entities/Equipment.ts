import {
  Column,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  OneToMany,
} from "typeorm";
import { Service } from "./Service";
import { Training } from "./Training";

@Index("equipment_pkey", ["equipmentId"], { unique: true })
@Entity("equipment")
export class Equipment {
  @Column("uuid", {
    primary: true,
    name: "equipment_id",
    default: () => "gen_random_uuid()",
  })
  equipmentId: string;

  @Column("character varying", { name: "hardware_id", length: 255 })
  hardwareId: string;

  @Column("character varying", { name: "name", length: 255 })
  name: string;

  @Column("character varying", { name: "manufacturer", length: 255 })
  manufacturer: string;

  @OneToMany(() => Service, (service) => service.equipment)
  services: Service[];

  @ManyToMany(() => Training, (training) => training.equipment)
  @JoinTable({
    name: "training_equipment",
    joinColumns: [
      { name: "equipment_id", referencedColumnName: "equipmentId" },
    ],
    inverseJoinColumns: [
      { name: "training_id", referencedColumnName: "trainingId" },
    ],
    schema: "public",
  })
  trainings: Training[];
}
