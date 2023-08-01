import { MiddlewareConsumer, Module, RequestMethod } from "@nestjs/common";
import { ConcertController } from "./concerts.controller";
import { ConcertService } from "./concerts.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Concert } from "src/entities/concert.entity";
import { ConfigModule } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { UploadMiddleware } from "src/middlewares/upload-middelware";
import { SeatsService } from "src/seats/seats.service";
import { Seat } from "src/entities/seat.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([Concert, Seat]),
    ConfigModule.forRoot({ isGlobal: true }),
    JwtModule.register({ secret: process.env.JWT_SECRET_KEY }),
  ],
  controllers: [ConcertController],
  providers: [ConcertService, SeatsService],
})
export class ConcertModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(UploadMiddleware)
      .forRoutes({ path: "/concerts/registration", method: RequestMethod.POST });
  }
}
