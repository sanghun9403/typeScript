import { Module } from "@nestjs/common";
import { ReservationsService } from "./reservations.service";
import { ReservationsController } from "./reservations.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Reservation } from "src/entities/reservation.entity";
import { Concert } from "src/entities/concert.entity";
import { User } from "src/entities/user.entity";
import { SeatsService } from "src/seats/seats.service";
import { Seat } from "src/entities/seat.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Reservation, Concert, User, Seat])],
  providers: [ReservationsService, SeatsService],
  controllers: [ReservationsController],
})
export class ReservationsModule {}
