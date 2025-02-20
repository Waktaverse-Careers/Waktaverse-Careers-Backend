import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { SheetsService } from 'src/sheets/sheets.service';
import { TeamRepository } from './teams.repository';
import { Team } from './entities/team.entity';
import { Raw } from 'typeorm';

@Injectable()
export class TeamsService {
  private readonly logger = new Logger(TeamsService.name);

  constructor(
    private readonly sheetsService: SheetsService,
    private readonly teamRepo: TeamRepository,
  ) {}

  async teamUpdate() {
    const { status, data } = await this.sheetsService.getSheet();
    if (status !== 200) {
      this.logger.error('Failed to fetch sheet data');
      throw new BadRequestException('Failed to fetch sheet data');
    }

    const teams = await Promise.all(
      data.map(async (item) => {
        const existingTeam = await this.teamRepo.findOne({
          where: { id: item.id },
        });
        if (existingTeam) {
          return existingTeam;
        } else {
          return this.teamRepo.create(item);
        }
      }),
    );

    return await this.teamRepo.saves(teams);
  }

  async findTeams(names: string[]): Promise<Team[]> {
    return await this.teamRepo.find({
      where: names.map((name) => ({
        people: Raw((alias) => `JSON_CONTAINS(${alias}, :value)`, {
          value: JSON.stringify({ name }),
        }),
      })),
    });
  }
}
