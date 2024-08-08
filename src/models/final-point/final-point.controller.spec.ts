import { Test, TestingModule } from '@nestjs/testing';
import { FinalPointController } from './final-point.controller';


describe('FinalBoardController', () => {
  let controller: FinalPointController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FinalPointController],
    }).compile();

    controller = module.get<FinalPointController>(FinalPointController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
