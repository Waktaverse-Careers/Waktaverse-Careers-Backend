import {
  IsBoolean,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { PeopleData, TeamType } from '../entities/team.entity';

export class SaveTeamDto {
  @IsBoolean()
  visible: boolean;

  @IsString()
  type: TeamType;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  keyword?: string;

  @IsOptional()
  @IsNumber()
  date?: string;

  @IsOptional()
  @IsString()
  slogan?: string;

  @IsObject()
  people: PeopleData[];

  @IsOptional()
  @IsString()
  review_url?: string;

  @IsOptional()
  @IsString()
  reference_url?: string;
}
