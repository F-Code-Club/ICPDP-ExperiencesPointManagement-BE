import { Test, TestingModule } from '@nestjs/testing';
import { FinalBoardService } from './final-board.service';

describe('FinalBoardService', () => {
  let service: FinalBoardService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FinalBoardService],
    }).compile();

    service = module.get<FinalBoardService>(FinalBoardService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
