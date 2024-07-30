import { Test, TestingModule } from '@nestjs/testing';
import { ClubMemberService } from './club-member.service';

describe('ClubMemberService', () => {
  let service: ClubMemberService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClubMemberService],
    }).compile();

    service = module.get<ClubMemberService>(ClubMemberService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
