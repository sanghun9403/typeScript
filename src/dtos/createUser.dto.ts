import { IsEmail, IsNotEmpty, IsString, Length } from "class-validator";

export class CreateUserDto {
  @IsNotEmpty({ message: "이메일은 필수 입력 항목입니다." })
  @IsEmail({}, { message: "유효한 이메일 형식이 아닙니다." })
  email: string;

  @IsNotEmpty({ message: "이름은 필수 입력 항목입니다." })
  @IsString()
  @Length(4, 10)
  name: string;

  @IsNotEmpty({ message: "비밀번호는 필수 입력 항목입니다." })
  @IsString()
  @Length(4, 20)
  password: string;

  confirmPassword: string;

  @IsNotEmpty({ message: "핸드폰 번호는 필수 입력 항목입니다." })
  @IsString()
  @Length(10, 11, { message: "하이픈을 빼고 입력해주세요" })
  phoneNumber: string;

  @IsNotEmpty({ message: "사용자/관리자를 선택해주세요." })
  isAdmin: boolean;
}
