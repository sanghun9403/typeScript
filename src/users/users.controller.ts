import { Controller, Post, Body, HttpStatus, ValidationPipe } from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDto } from "src/dtos/createUser.dto";

@Controller()
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post("signup")
  async signup(@Body(new ValidationPipe()) createUserDto: CreateUserDto) {
    await this.userService.signUp(createUserDto);
    return { message: "회원가입이 완료되었습니다.", code: HttpStatus.CREATED };
  }
}
