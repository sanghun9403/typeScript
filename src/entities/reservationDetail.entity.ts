import {
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Reservation } from "./reservation.entity";
import { Seat } from "./seat.entity";

@Entity("reservation_details")
export class ReservationDetail {
  @PrimaryGeneratedColumn({ type: "int" })
  id: number;

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

  @ManyToOne(() => Reservation, (reservation) => reservation.reservationDetails, {
    onDelete: "CASCADE",
    nullable: false,
  })
  reservation: Reservation;

  @OneToOne(() => Seat, (seat) => seat.reservationDetail, {
    onDelete: "CASCADE",
    nullable: false,
  })
  seat: Seat;
}
