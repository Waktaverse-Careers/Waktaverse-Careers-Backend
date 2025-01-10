import { BadRequestException, Controller, Get } from '@nestjs/common';
import { SheetsService } from './sheets.service';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SaveTeamDto } from 'src/teams/dto/save-team.dto';

@ApiTags('Sheets')
@Controller('sheets')
export class SheetsController {
  constructor(private readonly sheets: SheetsService) {}

  @ApiOperation({
    summary: 'sheet team 데이터 요청',
    description: 'sheet에 저장되어있는 team 데이터 가져오는 api',
  })
  @ApiOkResponse({ description: '결과로는 저렇게 나옴', type: [SaveTeamDto] })
  @Get()
  async getSheet() {
    const { data, status } = await this.sheets.getSheet();
    if (status === 200) return data;
    throw new BadRequestException();
  }
}
