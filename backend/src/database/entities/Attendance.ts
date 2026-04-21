import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { GymMember } from "./GymMember";

@Index("attendance_pkey", ["attendanceId"], { unique: true })
@Entity("attendance")
export class Attendance {
  @Column("timestamp without time zone", { name: "entry_time" })
  entryTime: Date;

  @Column("timestamp without time zone", { name: "exit_time" })
  exitTime: Date;

  @Column("uuid", {
    primary: true,
    name: "attendance_id",
    default: () => "gen_random_uuid()",
  })
  attendanceId: string;

  @ManyToOne(() => GymMember, (gymMember) => gymMember.attendances)
  @JoinColumn([{ name: "member_id", referencedColumnName: "memberId" }])
  member: GymMember;
}
