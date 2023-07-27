import {
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "../entities/user.entity";
import { Point } from "./point.entity";
import { Seat } from "./seat.entity";

@Entity()
export class Reservation {
  @PrimaryGeneratedColumn({ type: "int" })
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.reservations, {
    onDelete: "CASCADE",
    nullable: false,
  })
  user: User;

  @OneToMany(() => Seat, (seat) => seat.reservations, {
    onDelete: "CASCADE",
    nullable: false,
  })
  seat: Seat;

  @OneToMany(() => Point, (point) => point.reservation, {
    nullable: false,
  })
  points: Point[];
}
