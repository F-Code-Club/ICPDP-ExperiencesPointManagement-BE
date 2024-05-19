import { Test, TestingModule } from '@nestjs/testing';
import { PointBoardService } from './point-board.service';

describe('PointBoardService', () => {
  let service: PointBoardService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PointBoardService],
    }).compile();

    service = module.get<PointBoardService>(PointBoardService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
