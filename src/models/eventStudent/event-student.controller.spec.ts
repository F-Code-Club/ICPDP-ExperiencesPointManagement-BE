import { Test, TestingModule } from '@nestjs/testing';
import { EventStudentController } from './event-student.controller';

describe('EventStudentController', () => {
  let controller: EventStudentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EventStudentController],
    }).compile();

    controller = module.get<EventStudentController>(EventStudentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
