import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Concert } from "src/entities/concert.entity";
import { Seat } from "src/entities/seat.entity";
import { EntityManager, Repository } from "typeorm";

@Injectable()
export class SeatsService {
  constructor(
    @InjectRepository(Seat)
    private seatRepository: Repository<Seat>
  ) {}

  // 좌석생성
  async createSeats(concert: Concert, maxSeats: number) {
    try {
      // 트랜잭션 사용을 위해 entityManeger 사용
      const entityManager = this.seatRepository.manager;

      // 좌석의 등급 비율을 2:3:5로 설정
      const seatRatio = { S: 2, A: 3, B: 5 };

      const totalRatio = seatRatio.S + seatRatio.A + seatRatio.B; // 10

      // maxSeats에 따라 각 좌석의 개수 계산
      const ratioCaculate = {
        S: Math.floor((seatRatio.S / totalRatio) * maxSeats),
        A: Math.floor((seatRatio.A / totalRatio) * maxSeats),
        B: Math.floor((seatRatio.B / totalRatio) * maxSeats),
      };

      const seatList = [];

      for (const [grade, number] of Object.entries(ratioCaculate)) {
        for (let i = 1; i <= number; i++) {
          const seat = new Seat();
          seat.seatNumber = i;
          seat.grade = grade;
          seat.price = this.seatPriceByGrade(grade);
          seat.status = false;
          seat.concert = concert;
          seatList.push(seat);
        }
      }

      await entityManager.transaction(async (transactionEntityManger: EntityManager) => {
        await transactionEntityManger.save(Seat, seatList);
      });
    } catch (err) {
      throw err;
    }
  }

  // 좌석 가격
  seatPriceByGrade(grade: string): number {
    const seatPrice = { S: 50000, A: 30000, B: 10000 };

    return seatPrice[grade];
  }

  // 좌석상태 체크
  async checkSeatStatus(concertId: number): Promise<Seat[]> {
    const seats = await this.seatRepository.find({
      where: { concert: { id: concertId }, status: false },
    });
    return seats;
  }

  // 좌석상태 업데이트
  async updateSeatStatus(id: number, status: boolean): Promise<void> {
    await this.seatRepository.update({ id }, { status });
  }

  // 유효한 좌석 검사
  async validateSeat(id: number, grade: string, price: number, status: boolean): Promise<boolean> {
    const seat = await this.seatRepository.findOne({ where: { id } });
    if (!seat || seat.grade !== grade || seat.price !== price || seat.status !== status) {
      return false;
    }
    return true;
  }
}
