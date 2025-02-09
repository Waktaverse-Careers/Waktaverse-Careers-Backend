import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from 'src/users/entities/user.entity';

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

  @Column({ name: 'BIO', type: 'text', nullable: true, comment: '자기소개' })
  bio: string;

  @OneToMany(() => PortfolioTag, (tag) => tag.portfolio)
  tags: PortfolioTag[];

  @OneToMany(() => Work, (work) => work.portfolio, { cascade: true })
  works: Work[];

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

@Entity('tags')
export class PortfolioTag {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'TAG_NAME', comment: '포트폴리오 태그 이름' })
  name: string;

  @ManyToOne(() => Portfolio, (portfolio) => portfolio.tags, {
    onDelete: 'CASCADE',
  })
  portfolio: Portfolio;
}

@Entity('works')
export class Work {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'TITLE', length: 100, comment: '작업물 제목' })
  title: string;

  @Column({ name: 'TAGS', type: 'simple-array', comment: '작업물 태그' })
  tags: string[];

  @Column({
    name: 'IMAGE_ID',
    type: 'text',
    nullable: true,
    comment: '작업물 썸네일 이미지 ID',
  })
  imageId: string;

  @Column({ name: 'URL', type: 'text', comment: '작업물 URL' })
  url: string;

  @ManyToOne(() => Portfolio, (portfolio) => portfolio.works, {
    onDelete: 'CASCADE',
  })
  portfolio: Portfolio;
}
