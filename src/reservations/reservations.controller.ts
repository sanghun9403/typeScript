import { Body, Controller, HttpStatus, Post, Res } from "@nestjs/common";
import { ReservationsService } from "./reservations.service";
import { CreateReservationDto } from "src/dtos/create-reservation.dto";
import { Response } from "express";

@Controller("reservation")
export class ReservationsController {
  constructor(private readonly reservationService: ReservationsService) {}

  @Post()
  async createReservation(
    @Body() createReservationDto: CreateReservationDto,
    @Res() res: Response
  ) {
    try {
      const reservation = await this.reservationService.createReservation(createReservationDto);

      res.status(HttpStatus.CREATED).json({ message: "예약이 완료되었습니다.", reservation });
    } catch (err) {
      throw err;
    }
  }
}
