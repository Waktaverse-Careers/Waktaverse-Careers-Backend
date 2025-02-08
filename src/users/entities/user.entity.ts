import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
} from 'typeorm';
import { ProfileData } from '../dto/update-profile.dto';
import { Portfolio } from '../../portfolios/entities/portfolio.entity';

export type UserRoleType = 'admin' | 'actice' | 'unactive' | 'ban' | 'delete';

@Entity({ name: 'wc_user' })
export class User {
  @PrimaryGeneratedColumn('increment', { name: 'ID', comment: '계정 고유 ID' })
  id: number;

  @Column({ name: 'USER_ID', nullable: false, comment: '계정 ID' })
  userId: string;

  @Column({
    name: 'USER_NICKNAME',
    nullable: false,
    comment: '닉네임',
  })
  nickname: string;

  @Column({
    name: 'USER_EXTRANAME',
    nullable: true,
    comment: '추가 닉네임',
  })
  extra_name: string;

  @Column({
    name: 'PROFILE_IMG',
    nullable: true,
    comment: '프로필 이미지 url',
    type: 'text',
  })
  profile_img: string;

  @CreateDateColumn({ name: 'CREATED_AT', comment: '생성 시간' })
  created_at: Date;

  @UpdateDateColumn({ name: 'UPDATED_AT', comment: '수정 시간' })
  updated_at: Date;

  @Column({ name: 'VISITED_AT', nullable: true, comment: '방문 시간' })
  visited_at: Date;

  @Column({
    name: 'PROVIDER',
    nullable: false,
    default: '',
    comment: 'oauth2 provider',
  })
  provider: string;

  @Column({
    name: 'USER_ROLE',
    type: 'enum',
    enum: ['admin', 'active', 'unactive', 'ban', 'delete'],
    default: 'unactive',
    comment: '역할',
  })
  role: UserRoleType;

  @Column({
    name: 'REFRESH_TOKEN',
    type: 'text',
    nullable: true,
    comment: 'refresh token',
  })
  refresh_token: string;

  @Column({
    name: 'Profile',
    type: 'json',
    nullable: true,
    comment: 'Profile Info',
  })
  profile?: ProfileData;

  @OneToOne(() => Portfolio, (portfolio) => portfolio.user)
  portfolios: Portfolio[];

  updateVisitedAt() {
    this.visited_at = new Date();
  }

  updateRefreshToken(refreshToken: string) {
    this.refresh_token = refreshToken;
    this.updateVisitedAt();
  }

  toResponseObject() {
    const { refresh_token, ...data } = this;
    return data;
  }
}
