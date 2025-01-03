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

  @Column({ name: 'USER_ID', nullable: false, comment: '닉네임' })
  userId: string;

  @Column({ name: 'USER_PASSWORD', nullable: false, comment: '비밀번호' })
  password: string;

  @Column({
    name: 'USER_NICKNAME',
    length: 8,
    nullable: false,
    comment: '닉네임',
  })
  nickname: string;

  @CreateDateColumn({ name: 'CREATED_AT', comment: '생성 시간' })
  created_at: Date;

  @UpdateDateColumn({ name: 'UPDATED_AT', comment: '수정 시간' })
  updated_at: Date;

  @Column({ name: 'VISITED_AT', nullable: true, comment: '방문 시간' })
  visited_at: Date;

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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...data } = this;
    return data;
  }
}
