import { Test, TestingModule } from '@nestjs/testing';
import { PointBoardController } from './point-board.controller';


describe('PointBoardController', () => {
  let controller: PointBoardController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PointBoardController],
    }).compile();

    controller = module.get<PointBoardController>(PointBoardController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
