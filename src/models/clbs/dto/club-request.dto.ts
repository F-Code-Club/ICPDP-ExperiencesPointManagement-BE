import { UsersDto } from 'src/dto/users.dto';
import { ClbsDto } from 'src/dto/clbs.dto';
import { ApiProperty } from '@nestjs/swagger';

export class CreateClubRequestDto {
  @ApiProperty({
    example: UsersDto,
  })
  usersDto: UsersDto;

  @ApiProperty({
    example: ClbsDto
  })
  clbsDto: ClbsDto;
}
