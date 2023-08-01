import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "../entities/user.entity";
import { Point } from "./point.entity";
import { ReservationDetail } from "./reservationDetail.entity";
import { Concert } from "./concert.entity";

@Entity("reservations")
export class Reservation {
  @PrimaryGeneratedColumn({ type: "int" })
  id: number;

  @Column()
  totalPrice: number;

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

  @ManyToOne(() => User, (user) => user.reservations, {
    onDelete: "CASCADE",
    nullable: false,
  })
  user: User;

  @ManyToOne(() => Concert, (concert) => concert.reservations, {
    onDelete: "CASCADE",
    nullable : false
  })
  concert : Concert

  @OneToMany(() => Point, (point) => point.reservation, {
    eager: true,
    nullable: false,
  })
  points: Point[];

  @OneToMany(() => ReservationDetail, (detail) => detail.reservation, {
    eager: true,
    cascade: true,
    nullable: false,
  })
  reservationDetails: ReservationDetail[];
}
