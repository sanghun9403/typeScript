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
import { JwtAuthGuard } from "src/middlewares/jwt-auth.guard";
import { CreateConcertDto } from "src/dtos/create-concert.dto";

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

      res.status(HttpStatus.OK).json({ concertInfo });
    } catch (err) {
      throw err;
    }
  }

  @Post("/search")
  async getConcertByTitle(@Query("title") title: string, @Res() res: Response) {
    try {
      const concerts = await this.concertService.getConcertByTitle(title);

      if (!title) {
        return res.status(HttpStatus.BAD_REQUEST).json("검색키워드를 입력해주세요");
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

      res.status(HttpStatus.OK).json(concertDetail);
    } catch (err) {
      throw err;
    }
  }
}
