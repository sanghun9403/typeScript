import { IsNotEmpty, IsNumber } from "class-validator";

export class CreateReservationDto {
  @IsNumber()
  userId: number;

  @IsNumber()
  concertId: number;

  @IsNotEmpty({ message: "좌석을 선택해주세요" })
  selectedSeats: { id: number; grade: string; price: number; status: boolean }[];
}
