import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from "typeorm";

export type ServiceType = "MANICURE" | "PEDICURE" | "HAIRCUT";

@Entity("bookings")
export class Booking {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ length: 80 })
  clientName!: string;

  @Column({ length: 16 })
  clientPhone!: string;

  @Index()
  @Column()
  startsAt!: Date;

  @Column({ type: "varchar", length: 16 })
  service!: ServiceType;

  @Column({ type: "text", nullable: true })
  notes?: string | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
