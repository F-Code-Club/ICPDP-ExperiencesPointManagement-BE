import { Test, TestingModule } from '@nestjs/testing';
import { ClbsController } from './clbs.controller';

describe('ClbsController', () => {
  let controller: ClbsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClbsController],
    }).compile();

    controller = module.get<ClbsController>(ClbsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
