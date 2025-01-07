import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export type UserRoleType = 'admin' | 'user' | 'ban';

@Entity({ name: 'wc_user' })
export class User {
  @PrimaryGeneratedColumn('uuid', { name: 'ID', comment: '계정 고유 ID' })
  id: string;

  @Column({ name: 'USER_ID', nullable: false, comment: '계정 ID' })
  userId: string;

  @Column({
    name: 'USER_NICKNAME',
    length: 8,
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

  @Column({ name: 'PROFILE_IMG', nullable: true, comment: '프로필 이미지 url' })
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
    enum: ['admin', 'user', 'ban'],
    default: 'user',
    comment: '역할',
  })
  role: UserRoleType;

  updateVisitedAt() {
    this.visited_at = new Date();
  }

  toResponseObject() {
    const { id, ...data } = this;
    return data;
  }
}
