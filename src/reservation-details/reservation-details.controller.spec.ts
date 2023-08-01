import { Test, TestingModule } from '@nestjs/testing';
import { ReservationDetailsController } from './reservation-details.controller';

describe('ReservationDetailsController', () => {
  let controller: ReservationDetailsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReservationDetailsController],
    }).compile();

    controller = module.get<ReservationDetailsController>(ReservationDetailsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
