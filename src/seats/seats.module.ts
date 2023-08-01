import { Module } from '@nestjs/common';
import { SeatsService } from './seats.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Seat } from 'src/entities/seat.entity';

@Module({
  imports : [TypeOrmModule.forFeature([Seat])],
  providers: [SeatsService],
  exports: [SeatsService]
})
export class SeatsModule {}
