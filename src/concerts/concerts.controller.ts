import {
  Controller,
  Post,
  UseGuards,
  ValidationPipe,
  Req,
  Res,
  Body,
  HttpStatus,
  Get,
  Query,
  Param,
} from "@nestjs/common";
import { Response, Request } from "express";
import { ConcertService } from "./concerts.service";
import { JwtAuthGuard } from "src/middlewares/jwtAuth.guard";
import { CreateConcertDto } from "src/dtos/createConcert.dto";

@Controller("concerts")
export class ConcertController {
  constructor(private readonly concertService: ConcertService) {}

  @Post("registration")
  @UseGuards(JwtAuthGuard)
  async createConcert(
    @Body(new ValidationPipe()) createConcertDto: CreateConcertDto,
    @Req() req: Request,
    @Res() res: Response
  ) {
    try {
      const concertImage = req.file ? req.file.location : null;
      const { isAdmin, userId } = req.user;

      if (!isAdmin) {
        return res.status(HttpStatus.FORBIDDEN).json({ message: "공연등록 권한이 없습니다." });
      }

      await this.concertService.createConcert({
        ...createConcertDto,
        concertImage: concertImage,
        userId: userId,
      });
      res.status(HttpStatus.CREATED).json({ message: "공연등록이 완료되었습니다." });
    } catch (err) {
      throw err;
    }
  }

  @Get()
  async getConcerts(@Res() res: Response) {
    try {
      const concertInfo = await this.concertService.getConcertsInfo();

      if (!concertInfo) {
        return res.status(HttpStatus.NOT_FOUND).json("등록된 공연이 없습니다.");
      }

      res.status(HttpStatus.OK).json({ concertInfo });
    } catch (err) {
      throw err;
    }
  }

  @Get("/search")
  async getConcertByTitle(@Query("title") title: string, @Res() res: Response) {
    try {
      const concerts = await this.concertService.getConcertByTitle(title);

      if (!concerts) {
        return res.status(HttpStatus.NOT_FOUND).json("검색 결과가 없습니다.");
      }

      res.status(HttpStatus.OK).json({ concerts });
    } catch (err) {
      throw err;
    }
  }

  @Get(":id")
  async getConcertDetail(@Param("id") id: number, @Res() res: Response) {
    try {
      const concertDetail = await this.concertService.getConcertDetail(id);

      if (!concertDetail) {
        return res.status(HttpStatus.NOT_FOUND).json("등록된 공연이 없습니다.");
      }

      res.status(HttpStatus.OK).json(concertDetail);
    } catch (err) {
      throw err;
    }
  }
}
