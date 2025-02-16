import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { UserRoleType } from '../entities/user.entity';
import { UpdateProfileDto } from './update-profile.dto';

export class UpdateUserDto extends PartialType(UpdateProfileDto) {
  @ApiProperty({
    example: '김치국',
    description: '커리어즈에서 사용할 닉네임',
  })
  @IsOptional()
  @IsString()
  nickname?: string;

  @ApiProperty({
    example: ['김치', '김치전'],
    description: '활동했던 모든 닉네임',
  })
  @IsOptional({ each: true })
  @IsString({ each: true })
  extraName?: string[];

  @ApiProperty({
    example: '이미지 id',
    description: '업로드한 이미지 id 값',
  })
  @IsOptional()
  @IsString()
  profileImg?: string;

  @ApiProperty({
    example: 'active',
    description: '닉네임 설정시 유저상태가 active가 되게 설정',
  })
  @IsOptional()
  @IsEnum(['admin', 'active', 'unactive', 'ban', 'delete'])
  role?: UserRoleType = 'unactive';
}
