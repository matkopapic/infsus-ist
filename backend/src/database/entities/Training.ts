import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { Reservation } from "./Reservation";
import { Trainer } from "./Trainer";
import { Equipment } from "./Equipment";

@Index("training_pkey", ["trainingId"], { unique: true })
@Entity("training")
export class Training {
  @Column("integer", { name: "capacity" })
  capacity: number;

  @Column("character varying", { name: "name", length: 255 })
  name: string;

  @Column("timestamp without time zone", { name: "training_time" })
  trainingTime: Date;

  @Column("interval", { name: "duration" })
  duration: any;

  @Column("uuid", {
    primary: true,
    name: "training_id",
    default: () => "gen_random_uuid()",
  })
  trainingId: string;

  @OneToMany(() => Reservation, (reservation) => reservation.training)
  reservations: Reservation[];

  @ManyToOne(() => Trainer, (trainer) => trainer.trainings)
  @JoinColumn([{ name: "trainer_id", referencedColumnName: "trainerId" }])
  trainer: Trainer;

  @ManyToMany(() => Equipment, (equipment) => equipment.trainings)
  equipment: Equipment[];
}
