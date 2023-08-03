import { Module } from "@nestjs/common";
import { ReservationsService } from "./reservations.service";
import { ReservationsController } from "./reservations.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Reservation } from "src/entities/reservation.entity";
import { Concert } from "src/entities/concert.entity";
import { User } from "src/entities/user.entity";
import { SeatsService } from "src/seats/seats.service";
import { Seat } from "src/entities/seat.entity";
import { ConfigModule } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";

@Module({
  imports: [
    TypeOrmModule.forFeature([Reservation, Concert, User, Seat]),
    ConfigModule.forRoot({ isGlobal: true }),
    JwtModule.register({ secret: process.env.JWT_SECRET_KEY }),
  ],
  providers: [ReservationsService, SeatsService],
  controllers: [ReservationsController],
})
export class ReservationsModule {}
