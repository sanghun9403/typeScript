import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Concert } from "./concert.entity";
import { Reservation } from "./reservation.entity";

@Entity()
export class Seat {
  @PrimaryGeneratedColumn({ type: "int" })
  id: number;

  @Column({ type: "int", nullable: false })
  seatNumber: number;

  @Column({ nullable: false })
  grade: string;

  @Column({ nullable: false })
  price: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Concert, (concert) => concert.seats, {
    onDelete: "CASCADE",
  })
  concert: Concert;

  @OneToMany(() => Reservation, (reservation) => reservation.seat, {})
  reservations: Reservation[];
}
