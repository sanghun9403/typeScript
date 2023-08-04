import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ormConfig } from "./orm.config";
import { ConfigModule } from "@nestjs/config";
import { UsersModule } from "./users/users.module";
import { ConcertModule } from "./concerts/concerts.module";
import { SeatsModule } from "./seats/seats.module";
import { ReservationsModule } from "./reservations/reservations.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({ useFactory: ormConfig }),
    UsersModule,
    ConcertModule,
    SeatsModule,
    ReservationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
