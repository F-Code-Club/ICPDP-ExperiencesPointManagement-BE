import { Test, TestingModule } from '@nestjs/testing';
import { ClbsService } from './clbs.service';

describe('ClbsService', () => {
  let service: ClbsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClbsService],
    }).compile();

    service = module.get<ClbsService>(ClbsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
