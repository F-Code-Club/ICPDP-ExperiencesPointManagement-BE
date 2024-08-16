import { Test, TestingModule } from '@nestjs/testing';
import { EventDashBoardController } from './event-dash-board.controller';

describe('EventDashBoardController', () => {
  let controller: EventDashBoardController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EventDashBoardController],
    }).compile();

    controller = module.get<EventDashBoardController>(EventDashBoardController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
