import {
  Controller,
  Post,
  Body,
  HttpStatus,
  ValidationPipe,
  Res,
  Get,
  Param,
  UseGuards,
  Req,
  Patch,
} from "@nestjs/common";
import { Response, Request } from "express";
import { UsersService } from "./users.service";
import { CreateUserDto } from "src/dtos/create-user.dto";
import { LoginDto } from "src/dtos/login.dto";
import { JwtAuthGuard } from "src/middlewares/jwt-auth.guard";
import { UpdateUserDto } from "src/dtos/update-user.dto";
import { CustomError } from "src/custom/custom.error";

@Controller()
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post("signup")
  async signup(
    @Body(new ValidationPipe()) createUserDto: CreateUserDto,
    @Req() req: Request,
    @Res() res: Response
  ) {
    try {
      const profileImg = req.file ? req.file.location : null;

      await this.userService.signUp({ ...createUserDto, profileImg: profileImg });
      res.status(HttpStatus.CREATED).json({ message: "회원가입이 완료되었습니다." });
    } catch (err) {
      throw err;
    }
  }

  @Post("login")
  async login(
    @Body(new ValidationPipe()) loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response
  ) {
    try {
      const token = await this.userService.login(loginDto.email, loginDto.password);

      res.cookie("accessToken", `Bearer ${token}`, { httpOnly: true, maxAge: 600000 });
      res.status(HttpStatus.OK).json({ message: "로그인에 성공하였습니다." });
    } catch (err) {
      throw err;
    }
  }

  // 프로필 조회
  @Get("users/:id")
  @UseGuards(JwtAuthGuard)
  async getUserById(@Param("id") id: number, @Res() res: Response) {
    try {
      const userDetail = await this.userService.getUserById(id);
      res.status(HttpStatus.OK).json({ userDetail });
    } catch (err) {
      throw err;
    }
  }

  @Patch("users/:id")
  @UseGuards(JwtAuthGuard)
  async updateUser(
    @Param("id") id: number,
    @Body(new ValidationPipe()) updateUserDto: UpdateUserDto,
    @Req() req: Request,
    @Res() res: Response
  ) {
    try {
      const { userId } = req.user;

      if (userId != id) {
        throw new CustomError("수정권한이 없습니다.", HttpStatus.UNAUTHORIZED);
      }

      await this.userService.updateUser(id, updateUserDto);

      res.status(HttpStatus.OK).json({ message: "회원 정보수정이 완료되었습니다." });
    } catch (err) {
      throw err;
    }
  }

  @Get("user/:id/reservations")
  @UseGuards(JwtAuthGuard)
  async getUserReservationDetails(@Param("id") id: number) {
    return this.userService.getUserReservationDetails(id);
  }
}
