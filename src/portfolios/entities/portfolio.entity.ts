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
import { randomUUID } from 'crypto';
import { UpdatePortfolioDto } from '../dto/update-portfolio.dto';

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

  @Column({
    name: 'SHARED_ID',
    type: 'text',
    default: null,
    nullable: true,
  })
  sharedId?: string;

  @OneToMany(() => PortfolioVersion, (version) => version.portfolio)
  versions: PortfolioVersion[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  private changeVisibility(visibility: PortfolioVisibility) {
    if (visibility === 'private') this.sharedId = null;
    else this.sharedId = randomUUID();
    this.visibility = visibility;
  }

  updateMeta(dto: UpdatePortfolioDto) {
    const { visibility, currentVersion } = dto;
    if (currentVersion) this.currentVersion = currentVersion;
    if (visibility) this.changeVisibility(visibility);
  }
}
