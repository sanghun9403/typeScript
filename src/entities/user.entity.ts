import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
} from "typeorm";
import { Reservation } from "./reservation.entity";
import { Point } from "./point.entity";

@Entity("users")
@Unique(["email"])
export class User {
  @PrimaryGeneratedColumn({ type: "int" })
  id: number;

  @Column({ unique: true, nullable: false })
  email: string;

  @Column({ nullable: false })
  nickname: string;

  @Column({ nullable: false })
  password: string;

  @Column({ nullable: false, default: 1000000 })
  remainingPoint: number;

  @Column({ nullable: false })
  phoneNumber: string;

  @Column()
  profileImg: string;

  @Column({ nullable: false, default: false })
  isAdmin: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Reservation, (reservation) => reservation.user, {
    cascade: true,
  })
  reservations: Reservation[];

  @OneToMany(() => Point, (point) => point.user, {
    cascade: true,
  })
  points: Point[];
}
