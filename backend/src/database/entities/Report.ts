import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { Administrator } from "./Administrator";

@Index("report_pkey", ["reportId"], { unique: true })
@Entity("report")
export class Report {
  @Column("timestamp without time zone", { name: "report_time" })
  reportTime: Date;

  @Column("character varying", { name: "report_file", length: 255 })
  reportFile: string;

  @Column("uuid", {
    primary: true,
    name: "report_id",
    default: () => "gen_random_uuid()",
  })
  reportId: string;

  @ManyToOne(() => Administrator, (administrator) => administrator.reports)
  @JoinColumn([{ name: "admin_id", referencedColumnName: "adminId" }])
  admin: Administrator;
}
