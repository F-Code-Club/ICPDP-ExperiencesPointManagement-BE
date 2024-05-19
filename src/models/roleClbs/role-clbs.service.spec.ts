import { Test, TestingModule } from '@nestjs/testing';
import { RoleClbsService } from './role-clbs.service';

describe('RoleClbsService', () => {
  let service: RoleClbsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RoleClbsService],
    }).compile();

    service = module.get<RoleClbsService>(RoleClbsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
