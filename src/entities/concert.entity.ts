import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Seat } from "./seat.entity";
import { User } from "./user.entity";

@Entity("concerts")
export class Concert {
  @PrimaryGeneratedColumn({ type: "int" })
  id: number;

  @Column({ nullable: false })
  title: string;

  @Column({ nullable: true })
  concertImage: string;

  @Column()
  description: string;

  @Column({ nullable: false })
  concertTime: Date;

  @Column()
  concertCategory: string;

  @Column()
  location: string;

  @Column()
  maxSeats: number;

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

  @OneToMany(() => Seat, (seat) => seat.concert, {
    eager: true,
    cascade: true,
  })
  seats: Seat[];

  @ManyToOne(() => User, (user) => user.concerts, {
    onDelete: "CASCADE",
    nullable: false,
  })
  user: User;
}
