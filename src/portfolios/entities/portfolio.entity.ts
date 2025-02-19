import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { PortfolioVersion } from './portfolio-version.entity';

export type PortfolioVisibility = 'public' | 'partial' | 'private';

@Entity('portfolio')
export class Portfolio {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User, (user) => user.portfolio, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({
    name: 'CURRENT_VERSION_ID',
    type: 'int',
    nullable: true,
    default: null,
    comment: '현재 게시된 버전 번호',
  })
  currentVersion: number | null = null;

  @Column({
    name: 'VISIBILITY',
    type: 'enum',
    enum: ['public', 'partial', 'private'],
    default: 'private',
    comment: '공개 상태',
  })
  visibility: PortfolioVisibility = 'private';

  @OneToMany(() => PortfolioVersion, (version) => version.portfolio)
  versions: PortfolioVersion[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
