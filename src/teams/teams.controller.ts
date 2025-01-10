import { Body, Controller, Post, Put } from '@nestjs/common';
import { TeamsService } from './teams.service';
import { FindTeamsDto } from './dto/find-teams.dto';

@Controller('teams')
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Post('find')
  async findMyTeam(@Body() body: FindTeamsDto) {
    return await this.teamsService.findTeams(body.names);
  }

  @Put('update')
  async updateTeams() {
    return await this.teamsService.teamUpdate();
  }
}
