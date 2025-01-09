import { IsNotEmpty, IsNumber, IsObject } from 'class-validator';

export interface ProfileData {
  description?: string;
  contacts?: string[];
  tech?: string[];
}

export class UpdateProfileDto {
  @IsNotEmpty()
  @IsNumber()
  id: number;

  @IsNotEmpty()
  @IsObject()
  profile: ProfileData;
}
