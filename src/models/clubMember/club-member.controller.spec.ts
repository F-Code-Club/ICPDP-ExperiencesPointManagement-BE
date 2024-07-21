import { Test, TestingModule } from '@nestjs/testing';
import { ClubMemberController } from './club-member.controller';

describe('ClubMemberController', () => {
  let controller: ClubMemberController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClubMemberController],
    }).compile();

    controller = module.get<ClubMemberController>(ClubMemberController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
