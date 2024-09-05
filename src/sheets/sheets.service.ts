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
      range: '크레딧!A2:E',
    });
    const { data, status } = this.context;
    return { data: this.changeData(data.values), status };
  }

  changeData(data: string[][]) {
    const result = [];

    data.map((row: string[]) => {
      const arr = row[4].split(', ');
      const json = {
        type: row[0],
        team: row[1],
        keyword: row[2],
        description: row[3],
        people: arr,
      };
      result.push(json);
    });
    return result;
  }
}
