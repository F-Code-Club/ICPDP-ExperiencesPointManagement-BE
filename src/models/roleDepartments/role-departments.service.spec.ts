import { Test, TestingModule } from '@nestjs/testing';
import { RoleDepartmentsService } from './role-departments.service';

describe('RoleDepartmentsService', () => {
  let service: RoleDepartmentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RoleDepartmentsService],
    }).compile();

    service = module.get<RoleDepartmentsService>(RoleDepartmentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
