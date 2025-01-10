import { Injectable } from '@nestjs/common';
import { client_email, private_key } from '../../credentials.json';
import { google } from 'googleapis';
import { ConfigService } from '@nestjs/config';
import { SaveTeamDto } from 'src/teams/dto/save-team.dto';
import { PeopleData, TeamType } from 'src/teams/entities/team.entity';

@Injectable()
export class SheetsService {
  public authorize;
  public googleSheet;
  public context;
  private SHEET_ID;

  constructor(private readonly configService: ConfigService) {
    this.authorize = new google.auth.JWT(client_email, null, private_key, [
      'https://www.googleapis.com/auth/spreadsheets',
    ]);
    // google spread sheet api 가져오기
    this.googleSheet = google.sheets({
      version: 'v4',
      auth: this.authorize,
    });

    this.SHEET_ID = configService.get<string>('GOOGLE_SHEET_ID');
  }

  async getSheet() {
    this.context = await this.googleSheet.spreadsheets.values.get({
      spreadsheetId: this.SHEET_ID,
      range: '(최종) 정보 등록용 시트!A2:I',
    });
    const { data, status } = this.context;
    return { data: this.changeData(data.values), status };
  }

  changeData(data: string[][]): SaveTeamDto[] {
    const result = [];

    data.map((row: string[]) => {
      const arr = row[6].split(', ');
      const mul = arr.map((item) => {
        return item.split('|');
      });
      const data = mul.map((people) => {
        return {
          name: people[0],
          role: people[1] ? people[1].split('^') : [],
        };
      });

      const json: SaveTeamDto = {
        visible: row[0] === '검수 완료',
        type: row[1] as TeamType,
        name: row[2],
        keyword: JSON.stringify(row[3].split(', ')),
        date: row[4],
        slogan: row[5],
        people: data,
        review_url: JSON.stringify(row[7].split(',')),
        reference_url: JSON.stringify(row[8].split(',')),
      };
      result.push(json);
    });
    return result;
  }
}
