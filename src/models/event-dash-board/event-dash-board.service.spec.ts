import { Test, TestingModule } from '@nestjs/testing';
import { EventDashBoardService } from './event-dash-board.service';

describe('EventDashBoardService', () => {
  let service: EventDashBoardService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EventDashBoardService],
    }).compile();

    service = module.get<EventDashBoardService>(EventDashBoardService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
