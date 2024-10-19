import { BadRequestException, Controller, Get } from '@nestjs/common';
import { SheetsService } from './sheets.service';

@Controller('sheets')
export class SheetsController {
  constructor(private readonly sheets: SheetsService) {}

  @Get()
  async getSheet() {
    const { data, status } = await this.sheets.getSheet();
    if (status === 200) return data;
    throw new BadRequestException();
  }
}
