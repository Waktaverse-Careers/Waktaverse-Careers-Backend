import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { PortfolioVersion } from './portfolio-version.entity';

export type PortfolioVisibility = 'public' | 'partial' | 'private';

@Entity('portfolio')
export class Portfolio {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.portfolio)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({
    name: 'LATEST_VERSION',
    type: 'int',
    default: 1,
    comment: '최신 버전 번호',
  })
  latestVersion: number;

  @Column({
    name: 'CURRENT_VERSION',
    type: 'int',
    default: 1,
    comment: '현재 게시된 버전 번호',
  })
  currentVersion: number;

  @Column({
    name: 'VISIBILITY',
    type: 'enum',
    enum: ['public', 'partial', 'private'],
    default: 'public',
    comment: '공개 상태',
  })
  visibility: PortfolioVisibility;

  @OneToMany(() => PortfolioVersion, (version) => version.portfolio)
  versions: PortfolioVersion[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
