import { Test, TestingModule } from '@nestjs/testing';
import { FinalPointService } from './final-point.service';

describe('FinalBoardService', () => {
  let service: FinalPointService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FinalPointService],
    }).compile();

    service = module.get<FinalPointService>(FinalPointService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
