import { Injectable } from '@nestjs/common';
import { client_email, private_key } from '../../credentials.json';
import { google } from 'googleapis';
import { ConfigService } from '@nestjs/config';

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
      range: '(최종) 정보 등록용 시트!B2:I',
    });
    const { data, status } = this.context;
    return { data: this.changeData(data.values), status };
  }

  changeData(data: string[][]) {
    const result = [];

    data.map((row: string[]) => {
      const arr = row[5].split(', ');
      const mul = arr.map((item) => {
        return item.split('|');
      });
      const data = mul.map((people) => {
        return {
          name: people[0],
          jobs: people[1] ? people[1].split('^') : '',
        };
      });

      const json = {
        type: row[0],
        team: row[1],
        keyword: row[2].split(', '),
        date: row[3],
        description: row[4],
        people: data,
        feedback_url: row[6].split(','),
        ref_url: row[7].split(','),
      };
      result.push(json);
    });
    return result;
  }
}
