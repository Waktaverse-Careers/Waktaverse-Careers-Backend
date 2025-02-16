import { ApiProperty } from '@nestjs/swagger';
import { ArrayMinSize, IsArray, IsString } from 'class-validator';

export class FindTeamsDto {
  @ApiProperty({
    example: ['냐무냠', '냐무냠냠'],
    description: '참가한 팀을 알고싶은 닉네임 모두입력',
    required: true,
  })
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  names: string[];
}
