import { Test, TestingModule } from '@nestjs/testing';
import { RoleDepartmentsController } from './role-departments.controller';


describe('RoleDepartmentsController', () => {
  let controller: RoleDepartmentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RoleDepartmentsController],
    }).compile();

    controller = module.get<RoleDepartmentsController>(RoleDepartmentsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
