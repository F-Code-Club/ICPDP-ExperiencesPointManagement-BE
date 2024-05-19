import { Test, TestingModule } from '@nestjs/testing';
import { FinalBoardController } from './final-board.controller';

describe('FinalBoardController', () => {
  let controller: FinalBoardController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FinalBoardController],
    }).compile();

    controller = module.get<FinalBoardController>(FinalBoardController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
