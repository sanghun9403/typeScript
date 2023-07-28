import { IsNotEmpty, IsEmail, IsString } from "class-validator";

export class LoginDto {
  @IsNotEmpty({ message: "이메일은 필수 입력 항목입니다." })
  @IsEmail({}, { message: "유효한 이메일 형식이 아닙니다." })
  email: string;

  @IsNotEmpty({ message: "비밀번호는 필수 입력 항목입니다." })
  @IsString()
  password: string;
}
