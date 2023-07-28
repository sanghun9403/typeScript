import { IsEmail, IsNotEmpty, IsString, Length } from "class-validator";

export class CreateUserDto {
  @IsEmail({}, { message: "유효한 이메일 형식이 아닙니다." })
  email: string;

  @IsString()
  @Length(2, 10, { message: "닉네임은 2글자 이상 10글자 이하까지만 가능합니다." })
  nickname: string;

  @IsString()
  @Length(4, 20, { message: "비밀번호는 4자리 이상 20자리 이하까지만 가능합니다" })
  password: string;

  confirmPassword: string;

  @IsString()
  @Length(10, 11, { message: "핸드폰 번호는 하이픈을 빼고 입력해주세요" })
  phoneNumber: string;

  @IsNotEmpty({ message: "사용자/관리자를 선택해주세요." })
  isAdmin: boolean;
}
