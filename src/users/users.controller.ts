import {
  Controller,
  Post,
  Body,
  HttpStatus,
  ValidationPipe,
  Res,
  Get,
  Param,
} from "@nestjs/common";
import { Response } from "express";
import { UsersService } from "./users.service";
import { CreateUserDto } from "src/dtos/createUser.dto";
import { LoginDto } from "src/dtos/login.dto";

@Controller()
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post("signup")
  async signup(@Body(new ValidationPipe()) createUserDto: CreateUserDto) {
    try {
      await this.userService.signUp(createUserDto);
      return { message: "회원가입이 완료되었습니다.", code: HttpStatus.CREATED };
    } catch (err) {
      throw err;
    }
  }

  @Post("login")
  async login(
    @Body(new ValidationPipe()) loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response
  ) {
    try {
      const token = await this.userService.login(loginDto.email, loginDto.password);

      response.cookie("accessToken", `Bearer ${token}`, { httpOnly: true, maxAge: 600000 });
      response.status(HttpStatus.OK).json({ message: "로그인에 성공하였습니다." });
    } catch (err) {
      throw err;
    }
  }

  @Get("users/:id")
  async getUserById(@Param("id") id: number) {
    try {
      return await this.userService.getUserById(id);
    } catch (err) {
      throw err;
    }
  }
}
