import { Test, TestingModule } from '@nestjs/testing';
import { EventStudentService } from './event-student.service';

describe('EventStudentService', () => {
  let service: EventStudentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EventStudentService],
    }).compile();

    service = module.get<EventStudentService>(EventStudentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
