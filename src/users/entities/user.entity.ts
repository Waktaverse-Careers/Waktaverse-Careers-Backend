import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { ProfileData } from '../dto/update-profile.dto';
import { Portfolio } from 'src/portfolios/entities/portfolio.entity';
import { Team } from 'src/teams/entities/team.entity';

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
    type: 'simple-array',
    nullable: true,
    comment: '추가 닉네임',
  })
  extraName: string[];

  @Column({
    name: 'PROFILE_IMG',
    nullable: true,
    comment: '프로필 이미지 url',
    type: 'text',
  })
  profileImg: string;

  @CreateDateColumn({ name: 'CREATED_AT', comment: '생성 시간' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'UPDATED_AT', comment: '수정 시간' })
  updatedAt: Date;

  @Column({ name: 'VISITED_AT', nullable: true, comment: '방문 시간' })
  visitedAt: Date;

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
  refreshToken: string;

  @Column({
    name: 'PROFILE',
    type: 'json',
    nullable: true,
    comment: 'Profile Info',
  })
  profile?: ProfileData;

  @OneToOne(() => Portfolio, (portfolio) => portfolio.user, {
    cascade: true,
  })
  portfolio: Portfolio;

  @ManyToMany(() => Team, (team) => team.users) // Team과의 다대다 관계 설정
  @JoinTable({
    name: 'user_teams', // 중간 테이블 이름
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'team_id', referencedColumnName: 'id' },
  })
  teams: Team[];

  addmTeam(team: Team) {
    if (!this.teams) {
      this.teams = [];
    }
    this.teams.push(team);
  }

  removeTeam(team: Team) {
    this.teams = this.teams.filter((t) => t.id !== team.id);
  }

  updateVisitedAt() {
    this.visitedAt = new Date();
  }

  updateRefreshToken(refreshToken: string) {
    this.refreshToken = refreshToken;
    this.updateVisitedAt();
  }

  toResponseObject() {
    const { refreshToken, ...data } = this;
    return data;
  }
}
