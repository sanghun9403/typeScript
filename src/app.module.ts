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
import { ConcertModule } from "./concerts/concerts.module";
import { SeatsModule } from './seats/seats.module';
import { ReservationsModule } from './reservations/reservations.module';
import { PointsModule } from './points/points.module';
import { ReservationDetailsModule } from './reservation-details/reservation-details.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({ useFactory: ormConfig }),
    UsersModule,
    ConcertModule,
    SeatsModule,
    ReservationsModule,
    PointsModule,
    ReservationDetailsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
