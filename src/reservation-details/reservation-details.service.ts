import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ReservationDetail } from "src/entities/reservation-detail.entity";
import { Repository } from "typeorm";

@Injectable()
export class ReservationDetailsService {
  constructor(
    @InjectRepository(ReservationDetail)
    private reservationDetailRepository: Repository<ReservationDetail>
  ) {}

  // async createDetail(reservationId: number, seatId: number): Promise<ReservationDetail> {
  //   const reservationDetail = this.reservationDetailRepository.create({
  //     reservation: { id: reservationId },
  //     seat: { id: seatId },
  //   });
  //   return this.reservationDetailRepository.save(reservationDetail);
  // }
}
