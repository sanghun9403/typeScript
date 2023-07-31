import { HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CustomError } from "src/custom/custom.error";
import { CreateConcertDto } from "src/dtos/createConcert.dto";
import { Concert } from "src/entities/concert.entity";
import { Like, Repository } from "typeorm";

@Injectable()
export class ConcertService {
  constructor(
    @InjectRepository(Concert)
    private readonly concertRepository: Repository<Concert>
  ) {}

  // 공연등록
  async createConcert(createConcertDto: CreateConcertDto): Promise<Concert> {
    try {
      const { title, concertTime, location, userId } = createConcertDto;

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
      return this.concertRepository.save(newConcert);
    } catch (err) {
      throw err;
    }
  }

  // 공연전체조회
  async getConcertInfo(): Promise<Concert[]> {
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
          "seats",
        ],
      });

      return concerts;
    } catch (err) {
      throw err;
    }
  }

  // 공연 상세검색
}
