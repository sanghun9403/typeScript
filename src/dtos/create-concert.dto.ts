import { IsNotEmpty, MinDate } from "class-validator";

export class CreateConcertDto {
  @IsNotEmpty({ message: "공연제목은 필수입력 사항입니다." })
  title: string;

  concertImage: string;

  description: string;

  @IsNotEmpty({ message: "공연시간은 필수입력 사항입니다." })
  concertTime: Date;

  concertCategory: string;

  location: string;

  userId: number;

  @IsNotEmpty({ message: "최대 좌석수는 필수입력 사항입니다." })
  maxSeats: number;
}
