import { Test, TestingModule } from '@nestjs/testing';
import { EventPointService } from './event-point.service';

describe('EventStudentService', () => {
  let service: EventPointService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EventPointService],
    }).compile();

    service = module.get<EventPointService>(EventPointService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
