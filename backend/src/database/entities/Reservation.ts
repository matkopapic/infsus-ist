import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { GymMember } from "./GymMember";
import { Training } from "./Training";

@Index("reservation_pkey", ["reservationId"], { unique: true })
@Entity("reservation")
export class Reservation {
  @Column("uuid", {
    primary: true,
    name: "reservation_id",
    default: () => "gen_random_uuid()",
  })
  reservationId: string;

  @Column("timestamp with time zone", { name: "created_at" })
  createdAt: Date;

  @ManyToOne(() => GymMember, (gymMember) => gymMember.reservations)
  @JoinColumn([{ name: "member_id", referencedColumnName: "memberId" }])
  member: GymMember;

  @ManyToOne(() => Training, (training) => training.reservations)
  @JoinColumn([{ name: "training_id", referencedColumnName: "trainingId" }])
  training: Training;
}
