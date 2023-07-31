import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Concert } from "./concert.entity";
import { ReservationDetail } from "./reservationDetail.entity";

@Entity("seats")
export class Seat {
  @PrimaryGeneratedColumn({ type: "int" })
  id: number;

  @Column({ type: "int", nullable: false })
  seatNumber: number;

  @Column({ nullable: false })
  grade: string;

  @Column({ nullable: false })
  price: number;

  @Column({ nullable: false, default: false })
  status: Boolean;

  @CreateDateColumn({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP(6)",
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP(6)",
    onUpdate: "CURRENT_TIMESTAMP(6)",
  })
  updatedAt: Date;

  @ManyToOne(() => Concert, (concert) => concert.seats, {
    onDelete: "CASCADE",
  })
  concert: Concert;

  @OneToOne(() => ReservationDetail, (detail) => detail.seat, {
    onDelete: "CASCADE",
    nullable: false,
  })
  reservationDetail: ReservationDetail;
}
