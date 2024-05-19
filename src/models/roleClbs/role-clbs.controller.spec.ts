import { Test, TestingModule } from '@nestjs/testing';
import { RoleClbsController } from './role-clbs.controller';

describe('RoleClbsController', () => {
  let controller: RoleClbsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RoleClbsController],
    }).compile();

    controller = module.get<RoleClbsController>(RoleClbsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
