import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ormConfig } from "./orm.config";
import { ConfigModule } from "@nestjs/config";
import { UsersModule } from "./users/users.module";
// import { APP_FILTER } from "@nestjs/core";
// import { GlobalExceptionFilter } from "./custom/exceptionFilter";
// { provide: APP_FILTER, useClass: GlobalExceptionFilter }
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({ useFactory: ormConfig }),
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
