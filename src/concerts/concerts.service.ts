import { HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CustomError } from "src/custom/custom.error";
import { CreateConcertDto } from "src/dtos/create-concert.dto";
import { Concert } from "src/entities/concert.entity";
import { SeatsService } from "src/seats/seats.service";
import { Like, Repository } from "typeorm";

@Injectable()
export class ConcertService {
  constructor(
    @InjectRepository(Concert)
    private readonly concertRepository: Repository<Concert>,
    private readonly seatService: SeatsService
  ) {}

  // 공연등록
  async createConcert(createConcertDto: CreateConcertDto): Promise<Concert> {
    try {
      const { title, concertTime, location, userId, maxSeats } = createConcertDto;

      const existInfo = await this.concertRepository.findOne({
        where: [{ title, concertTime, location }],
      });

      if (existInfo) {
        throw new CustomError(
          "동일한 장소 및 시간의 콘서트는 등록할 수 없습니다.",
          HttpStatus.BAD_REQUEST
        );
      }

      const newConcert = this.concertRepository.create({
        ...createConcertDto,
        user: { id: userId },
      });

      const savedConcert = await this.concertRepository.save(newConcert);
      await this.seatService.createSeats(savedConcert, maxSeats);

      return savedConcert;
    } catch (err) {
      throw err;
    }
  }

  // 공연전체조회
  async getConcertsInfo(): Promise<Concert[]> {
    try {
      const getConcert = await this.concertRepository.find({
        select: [
          "id",
          "title",
          "concertImage",
          "description",
          "concertTime",
          "concertCategory",
          "location",
          "maxSeats",
          "seats",
        ],
      });

      return getConcert;
    } catch (err) {
      throw err;
    }
  }

  // 공연검색 (타이틀)
  async getConcertByTitle(title: string): Promise<Concert[]> {
    try {
      const concerts = await this.concertRepository.find({
        where: { title: Like(`%${title}%`) },
        select: [
          "id",
          "title",
          "concertImage",
          "description",
          "concertTime",
          "concertCategory",
          "location",
          "maxSeats",
        ],
      });

      return concerts;
    } catch (err) {
      throw err;
    }
  }

  // 공연 상세검색
  async getConcertDetail(id: number) {
    try {
      const getConcert = await this.concertRepository.findOne({
        where: { id },
        select: [
          "id",
          "title",
          "concertImage",
          "description",
          "concertTime",
          "concertCategory",
          "location",
          "maxSeats",
        ],
      });

      const availableSeats = await this.seatService.checkSeatStatus(getConcert.id);
      const seatInfos = [
        { grade: "S", availableSeats: 0, price: 50000 },
        { grade: "A", availableSeats: 0, price: 30000 },
        { grade: "B", availableSeats: 0, price: 10000 },
      ];

      for (const seat of availableSeats) {
        if (seat.grade === "S") seatInfos[0].availableSeats++;
        else if (seat.grade === "A") seatInfos[1].availableSeats++;
        else if (seat.grade === "B") seatInfos[2].availableSeats++;
      }

      return { ...getConcert, seatInfos };
    } catch (err) {
      throw err;
    }
  }
}
