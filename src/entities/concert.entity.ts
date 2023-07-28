import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Seat } from "./seat.entity";

@Entity("concerts")
export class Concert {
  @PrimaryGeneratedColumn({ type: "int" })
  id: number;

  @Column({ nullable: false })
  title: string;

  @Column()
  description: string;

  @Column()
  concertImage: string;

  @Column({ nullable: false })
  showTime: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Seat, (seat) => seat.concert, {
    cascade: true,
  })
  seats: Seat[];
}
