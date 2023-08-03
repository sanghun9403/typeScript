import { IsNotEmpty, IsString, Length } from "class-validator";

export class UpdateUserDto {
  @IsString()
  @Length(4, 20, { message: "비밀번호는 4자리 이상 20자리 이하까지만 가능합니다" })
  password: string;

  afterPassword: string;

  afterConfirmPassword: string;

  @IsString()
  @Length(10, 11, { message: "핸드폰 번호는 하이픈을 빼고 입력해주세요" })
  phoneNumber: string;

  profileImg: string;

  @IsNotEmpty({ message: "사용자/관리자를 선택해주세요." })
  isAdmin: boolean;
}
