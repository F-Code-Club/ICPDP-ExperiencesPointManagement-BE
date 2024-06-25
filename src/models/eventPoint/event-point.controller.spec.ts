import { Test, TestingModule } from '@nestjs/testing';
import { EventPointController } from './event-point.controller';

describe('EventStudentController', () => {
  let controller: EventPointController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EventPointController],
    }).compile();

    controller = module.get<EventPointController>(EventPointController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
