import { MiddlewareConsumer, Module, RequestMethod } from "@nestjs/common";
import { ConcertController } from "./concert.controller";
import { ConcertService } from "./concert.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Concert } from "src/entities/concert.entity";
import { ConfigModule } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { UploadMiddleware } from "src/middlewares/uploadMiddelware";

@Module({
  imports: [
    TypeOrmModule.forFeature([Concert]),
    ConfigModule.forRoot({ isGlobal: true }),
    JwtModule.register({ secret: process.env.JWT_SECRET_KEY }),
  ],
  controllers: [ConcertController],
  providers: [ConcertService],
})
export class ConcertModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(UploadMiddleware)
      .forRoutes({ path: "/concerts/registration", method: RequestMethod.POST });
  }
}
