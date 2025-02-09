import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Portfolio } from './portfolio.entity';

@Entity('tags')
export class Tag {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'TAG_NAME', comment: '태그 이름' })
  name: string;

  @ManyToMany(() => Portfolio, (portfolio) => portfolio.tags)
  @JoinTable()
  portfolio: Portfolio;
}
