import { Entity, Column, PrimaryColumn } from 'typeorm';

export interface PeopleData {
  name: string;
  role: string[];
}

export type TeamType =
  | '노래'
  | '고놀'
  | '서비스'
  | '팬메이드'
  | '컨텐츠'
  | '온/오프 콘서트'
  | '팬영상'
  | '조공컨텐츠';

@Entity({ name: 'wc_team' })
export class Team {
  @PrimaryColumn('varchar', { name: 'TEAM_ID', comment: 'Team id' }) // 타입과 설정을 변경
  id: string;

  @Column({
    name: 'TEAM_TYPE',
    type: 'enum',
    enum: [
      '노래',
      '고놀',
      '서비스',
      '팬메이드',
      '컨텐츠',
      '온/오프 콘서트',
      '팬영상',
      '조공컨텐츠',
    ],
    comment: 'team type',
  })
  type: TeamType;

  @Column({
    name: 'TEAM_LOGO',
    type: 'text',
    nullable: true,
    comment: 'team logo url',
  })
  logo?: string;

  @Column({ name: 'TEAM_NAME', comment: 'team name' })
  name: string;

  @Column({ name: 'TEAM_SLOGAN', nullable: true, comment: 'team slogan' })
  slogan?: string;

  @Column({ name: 'TEAM_KEYWORD', comment: 'team keywords' })
  keyword: string;

  @Column({ name: 'TEAM_VISIBLE', comment: 'team is Visible', default: false })
  visible: boolean;

  @Column({ name: 'TEAM_PEOPLE', type: 'json', comment: 'team users info' })
  people: PeopleData[] = [];

  @Column({ name: 'DATE', comment: 'team date' })
  date: string;

  @Column({ name: 'REVIEW_URL', type: 'text', comment: 'team 후기 url' })
  review_url: string;

  @Column({ name: 'REFERENCE_URL', type: 'text', comment: 'team 참조 url' })
  reference_url: string;
}
