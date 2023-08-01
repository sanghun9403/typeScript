import { Test, TestingModule } from '@nestjs/testing';
import { ReservationDetailsService } from './reservation-details.service';

describe('ReservationDetailsService', () => {
  let service: ReservationDetailsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReservationDetailsService],
    }).compile();

    service = module.get<ReservationDetailsService>(ReservationDetailsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
