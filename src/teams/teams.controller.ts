import { Body, Controller, Post, Put } from '@nestjs/common';
import { TeamsService } from './teams.service';
import { FindTeamsDto } from './dto/find-teams.dto';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Teams')
@Controller('teams')
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @ApiOperation({
    summary: '닉네임 기반 소속 team 데이터 요청',
    description: '사용자의 닉네임 값들 기반으로 소속한 팀 찾아보는 api',
  })
  @ApiBody({ type: FindTeamsDto })
  @Post('find')
  async findMyTeam(@Body() body: FindTeamsDto) {
    return await this.teamsService.findTeams(body.names);
  }

  @ApiOperation({
    summary: 'team data update',
    description: '강제로 sheet에 있는 내용 값 업데이트',
  })
  @Put('update')
  async updateTeams() {
    return await this.teamsService.teamUpdate();
  }
}
