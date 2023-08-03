import { HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CustomError } from "src/custom/custom.error";
import { CreateReservationDto } from "src/dtos/create-reservation.dto";
import { Concert } from "src/entities/concert.entity";
import { Point } from "src/entities/point.entity";
import { ReservationDetail } from "src/entities/reservation-detail.entity";
import { Reservation } from "src/entities/reservation.entity";
import { Seat } from "src/entities/seat.entity";
import { User } from "src/entities/user.entity";
import { SeatsService } from "src/seats/seats.service";
import { EntityManager, Repository } from "typeorm";

@Injectable()
export class ReservationsService {
  constructor(
    @InjectRepository(Reservation)
    private reservationRepository: Repository<Reservation>,
    @InjectRepository(Concert)
    private concertRepository: Repository<Concert>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private seatService: SeatsService
  ) {}

  // 예약
  async createReservation(createReservationDto: CreateReservationDto) {
    try {
      const { userId, concertId, selectedSeats } = createReservationDto;
      const entityManager = this.reservationRepository.manager;

      const user = await this.userRepository.findOne({ where: { id: userId } });
      const concert = await this.concertRepository.findOne({ where: { id: concertId } });
      const checkSeat = selectedSeats.filter((seat) => seat.status === false);
      if (!user || !concert || checkSeat.length !== selectedSeats.length) {
        throw new CustomError(
          "에약 정보가 올바르지 않습니다. 다시 시도바랍니다.",
          HttpStatus.BAD_REQUEST
        );
      }

      const totalPrice = selectedSeats.reduce((total, seat) => total + seat.price, 0);

      await entityManager.transaction(async (transactionalEntityManager: EntityManager) => {
        // 좌석 등급 및 가격 검증
        for (const seat of selectedSeats) {
          const isValidSeat = await this.seatService.validateSeat(
            seat.id,
            seat.grade,
            seat.price,
            seat.status
          );
          if (!isValidSeat) {
            throw new CustomError(
              "선택한 좌석이 판매되었거나, 등급 또는 가격이 일치하지 않습니다. 다시 선택해주세요.",
              HttpStatus.BAD_REQUEST
            );
          }
        }

        // 유저 포인트 확인 후 차감
        if (user.remainingPoint < totalPrice) {
          throw new CustomError("포인트가 부족합니다.", HttpStatus.BAD_REQUEST);
        }
        user.remainingPoint -= totalPrice;
        await transactionalEntityManager.save(user);

        // 예약 생성
        const reservation = transactionalEntityManager.create(Reservation, {
          user: { id: userId },
          concert: { id: concertId },
          totalPrice,
        });
        const newReservation = await transactionalEntityManager.save(reservation);

        // 포인트 사용 내역 저장
        const pointHistory = transactionalEntityManager.create(Point, {
          user: { id: userId },
          reservation: { id: newReservation.id },
          point: totalPrice,
          status: true,
        });
        await transactionalEntityManager.save(pointHistory);

        // 좌석 상태 변경
        for (const seat of selectedSeats) {
          if (!seat.status) {
            await this.seatService.updateSeatStatus(seat.id, true);
          }
        }

        // 예약 디테일 생성 및 저장
        const reservationDetail = selectedSeats.map((seat) => {
          return transactionalEntityManager.create(ReservationDetail, {
            reservation: { id: newReservation.id },
            seat: { id: seat.id },
          });
        });
        console.log(reservationDetail);
        await transactionalEntityManager.save(reservationDetail);

        return newReservation;
      });
    } catch (err) {
      throw err;
    }
  }

  // 예약취소
  async cancelReservation(userId: number, id: number) {
    const reservation = await this.reservationRepository.findOne({
      where: { id, user: { id: userId } },
      relations: ["user", "concert", "reservationDetails.seat"],
    });
    const entityManager = this.reservationRepository.manager;
    console.log(reservation.user.id, userId);
    if (!reservation.user || reservation.user.id !== userId) {
      throw new CustomError("예약 취소 권한이 없습니다.", HttpStatus.UNAUTHORIZED);
    } else if (!reservation) {
      throw new CustomError("예약 정보가 없습니다.", HttpStatus.NOT_FOUND);
    } else if (!reservation.status) {
      throw new CustomError("이미 취소된 예약입니다.", HttpStatus.BAD_REQUEST);
    }

    const currentTime = new Date();
    const concertTime = new Date(reservation.concert.concertTime);
    const availableCancelTime = new Date(concertTime.getTime() - 3 * 60 * 60 * 1000);

    if (currentTime >= availableCancelTime) {
      throw new CustomError(
        "공연 시작 3시간 전까지만 예약 취소가 가능합니다.",
        HttpStatus.BAD_REQUEST
      );
    }

    await entityManager.transaction(async (transactionalEntityManager: EntityManager) => {
      // 유저 포인트 환불
      const user = reservation.user;
      const refundPoint = reservation.totalPrice;
      user.remainingPoint += refundPoint;
      await transactionalEntityManager.save(user);

      // 포인트 사용 내역의 상태 수정
      const pointHistory = await transactionalEntityManager.findOne(Point, {
        where: { reservation: { id: id } },
      });
      if (pointHistory) {
        pointHistory.status = false;
        await transactionalEntityManager.save(pointHistory);
      }

      // 좌석 상태 변경
      for (const reservationDetail of reservation.reservationDetails) {
        console.log(reservationDetail);
        const seat = await transactionalEntityManager.findOne(Seat, {
          where: { id: reservationDetail.seat.id },
        });
        if (seat && seat.status) {
          seat.status = false;
          await transactionalEntityManager.save(seat);
        }
      }

      reservation.status = false;
      await transactionalEntityManager.save(reservation);
    });
  }

  async getReservationDetails(
    id: number
  ): Promise<{ concertTitle: string; reservationDetails: ReservationDetail[] }> {
    const reservation = await this.reservationRepository.findOne({
      where: { id },
      relations: ["concert", "reservationDetails", "reservationDetails.seat"],
    });

    if (!reservation) {
      throw new CustomError("예약 정보를 찾을 수 없습니다", HttpStatus.NOT_FOUND);
    }

    return {
      concertTitle: reservation.concert.title,
      reservationDetails: reservation.reservationDetails,
    };
  }
}
