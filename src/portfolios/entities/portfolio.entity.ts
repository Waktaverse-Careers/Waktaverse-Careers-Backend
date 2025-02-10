import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  ManyToMany,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Tag } from './tag.entity';

export type PortfolioVisibility = 'public' | 'partial' | 'private';

@Entity('portfolios')
export class Portfolio {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.portfolios, { eager: true })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'PORTFOLIO_NAME', length: 100, comment: '포트폴리오 이름' })
  portfolioName: string;

  @Column({
    name: 'DESCRIPTION',
    type: 'text',
    nullable: true,
    comment: '설명',
  })
  description: string;

  @ManyToMany(() => Tag, (tag) => tag.portfolio)
  tags: Tag[];

  @Column({
    name: 'VISIBILITY',
    type: 'enum',
    enum: ['public', 'partial', 'private'],
    default: 'public',
    comment: '공개 상태',
  })
  visibility: PortfolioVisibility;

  @Column({
    name: 'THUMBNAIL_ID',
    type: 'text',
    nullable: true,
    comment: '포폴 썸네일 이미지 ID',
  })
  thumbnailId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
