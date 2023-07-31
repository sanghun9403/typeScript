import { MiddlewareConsumer, Module, RequestMethod } from "@nestjs/common";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "src/entities/user.entity";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule } from "@nestjs/config";
import { UploadMiddleware } from "src/middlewares/uploadMiddelware";

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    ConfigModule.forRoot({ isGlobal: true }),
    JwtModule.register({ secret: process.env.JWT_SECRET_KEY }),
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UploadMiddleware).forRoutes({ path: "/signup", method: RequestMethod.POST });
  }
}
