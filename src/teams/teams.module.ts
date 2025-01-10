import { Module } from '@nestjs/common';
import { TeamsService } from './teams.service';
import { SheetsModule } from 'src/sheets/sheets.module';
import { TeamRepository } from './teams.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Team } from './entities/team.entity';
import { TeamsController } from './teams.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Team]), SheetsModule],
  controllers: [TeamsController],
  providers: [TeamsService, TeamRepository],
})
export class TeamsModule {}
