import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  ManyToMany,
  JoinTable,
  UpdateDateColumn,
} from 'typeorm';
import { Portfolio } from './portfolio.entity';
import { Tag } from './tag.entity';

export type portfolioStatusType =
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'review';

@Entity('portfolio_version')
export class PortfolioVersion {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Portfolio, { eager: true })
  @JoinColumn({ name: 'PORTFOLIO_ID' })
  portfolio: Portfolio;

  @Column({ name: 'PORTFOLIO_NAME', length: 100 })
  portfolioName: string;

  @Column({
    name: 'DESCRIPTION',
    type: 'text',
    nullable: true,
  })
  description: string;

  @Column({
    name: 'STATUS',
    type: 'enum',
    enum: ['pending', 'approved', 'rejected', 'review'],
    comment: '검토 상태',
    default: 'pending',
  })
  status: portfolioStatusType;

  @Column({
    name: 'IS_CURRENT',
    type: 'boolean',
    default: false,
    comment: '현재 활성화된 버전 여부',
  })
  isCurrent: boolean;

  @Column({
    name: 'CONTENT',
    type: 'json',
    comment: '포트폴리오 전체 내용 스냅샷',
  })
  content: JSON;

  @Column({
    name: 'THUMNAIL_ID',
    type: 'text',
    nullable: true,
    comment: '썸네일 id',
  })
  thumbnailId?: string;

  @ManyToMany(() => Tag, (tag) => tag.versions, {
    eager: true,
  })
  @JoinTable({
    name: 'portfolio_version_tag',
    joinColumn: {
      name: 'version_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'tag_id',
      referencedColumnName: 'id',
    },
  })
  tags: Tag[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
