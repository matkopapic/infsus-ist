import {
  Column,
  Entity,
  Index,
  JoinColumn,
  OneToMany,
  OneToOne,
} from "typeorm";
import { AppUser } from "./AppUser";
import { Report } from "./Report";

@Index("administrator_pkey", ["adminId"], { unique: true })
@Entity("administrator")
export class Administrator {
  @Column("uuid", { primary: true, name: "admin_id" })
  adminId: string;

  @OneToOne(() => AppUser, (appUser) => appUser.administrator)
  @JoinColumn([{ name: "admin_id", referencedColumnName: "userId" }])
  admin: AppUser;

  @OneToMany(() => Report, (report) => report.admin)
  reports: Report[];
}
