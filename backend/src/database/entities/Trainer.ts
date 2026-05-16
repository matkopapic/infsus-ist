import {
  Column,
  Entity,
  Index,
  JoinColumn,
  OneToMany,
  OneToOne,
} from "typeorm";
import { AppUser } from "./AppUser";
import { Training } from "./Training";

@Index("trainer_pkey", ["trainerId"], { unique: true })
@Entity("trainer")
export class Trainer {
  @Column("uuid", { primary: true, name: "trainer_id" })
  trainerId: string;

  @OneToOne(() => AppUser, (appUser) => appUser.trainer)
  @JoinColumn([{ name: "trainer_id", referencedColumnName: "userId" }])
  user: AppUser;

  @OneToMany(() => Training, (training) => training.trainer)
  trainings: Training[];
}
