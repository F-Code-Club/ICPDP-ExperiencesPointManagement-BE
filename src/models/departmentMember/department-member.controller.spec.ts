import { Test, TestingModule } from '@nestjs/testing';
import { DepartmentMemberController } from './department-member.controller';

describe('DepartmentMemberController', () => {
  let controller: DepartmentMemberController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DepartmentMemberController],
    }).compile();

    controller = module.get<DepartmentMemberController>(DepartmentMemberController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
