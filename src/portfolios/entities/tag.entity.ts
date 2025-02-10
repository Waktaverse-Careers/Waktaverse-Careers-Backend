import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { PortfolioVersion } from './portfolio-version.entity';

@Entity('tag')
export class Tag {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'NAME', length: 50, unique: true })
  name: string;

  @ManyToMany(() => PortfolioVersion, (version) => version.tags)
  versions: PortfolioVersion[];
}
