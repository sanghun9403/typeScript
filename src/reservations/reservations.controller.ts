import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Req,
  Res,
  UseGuards,
} from "@nestjs/common";
import { ReservationsService } from "./reservations.service";
import { CreateReservationDto } from "src/dtos/create-reservation.dto";
import { Response, Request } from "express";
import { JwtAuthGuard } from "src/middlewares/jwt-auth.guard";
import { ReservationDetail } from "src/entities/reservation-detail.entity";

@Controller("reservation")
export class ReservationsController {
  constructor(private readonly reservationService: ReservationsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
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

  @Delete(":id")
  @UseGuards(JwtAuthGuard)
  async cancelReservation(@Param("id") id: number, @Req() req: Request, @Res() res: Response) {
    try {
      const { userId } = req.user;

      await this.reservationService.cancelReservation(userId, id);

      res.status(HttpStatus.OK).json({ message: "예약취소가 완료되었습니다." });
    } catch (err) {
      throw err;
    }
  }

  // 예약 디테일 조회 API
  @Get("details/:id")
  @UseGuards(JwtAuthGuard)
  async getReservationDetails(@Param("id") id: number) {
    return this.reservationService.getReservationDetails(id);
  }
}
