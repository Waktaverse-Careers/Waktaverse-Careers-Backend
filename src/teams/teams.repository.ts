import { Repository } from 'typeorm';
import { Team } from './entities/team.entity';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TeamRepository {
  private readonly logger = new Logger(TeamRepository.name);
  constructor(
    @InjectRepository(Team) private readonly repo: Repository<Team>,
  ) {}

  async findById(id: number, option?: any): Promise<Team | undefined> {
    this.logger.log(`findById called with id: ${id}`);
    try {
      const team = await this.repo.findOne({ where: { id }, ...option });
      this.logger.log(`findById result: ${team}`);
      return team;
    } catch (error) {
      this.logger.error(`Error in findById with id: ${id}`, error);
      throw error;
    }
  }

  async createTeam(teamData: Partial<Team>): Promise<Team> {
    this.logger.log(`createTeam called with data: ${JSON.stringify(teamData)}`);
    try {
      const savedTeam = await this.repo.save(this.repo.create(teamData));
      this.logger.log(`createTeam result: ${savedTeam}`);
      return savedTeam;
    } catch (error) {
      this.logger.error(
        `Error in createTeam with data: ${JSON.stringify(teamData)}`,
        error,
      );
      throw error;
    }
  }

  create(teamData: Partial<Team>): Team {
    this.logger.log(`create called with data: ${JSON.stringify(teamData)}`);
    try {
      const createTeam = this.repo.create(teamData);
      this.logger.log(`createTeam result: ${createTeam.id}`);
      return createTeam;
    } catch (error) {
      this.logger.error(
        `Error in createTeam with data: ${JSON.stringify(teamData)}`,
        error,
      );
      throw error;
    }
  }

  async updateTeam(
    id: number,
    updateData: Partial<Team>,
  ): Promise<Team | undefined> {
    this.logger.log(
      `updateTeam called with id: ${id} and data: ${JSON.stringify(updateData)}`,
    );
    try {
      await this.update({ id }, updateData);
      const updatedTeam = await this.findById(id);
      this.logger.log(`updateTeam result: ${updatedTeam}`);
      return updatedTeam;
    } catch (error) {
      this.logger.error(
        `Error in updateTeam with id: ${id} and data: ${JSON.stringify(updateData)}`,
        error,
      );
      throw error;
    }
  }

  async findOne(options: any): Promise<Team | undefined> {
    this.logger.log(`findOne called with options: ${JSON.stringify(options)}`);
    try {
      const team = await this.repo.findOne(options);
      this.logger.log(`findOne result: ${team}`);
      return team;
    } catch (error) {
      this.logger.error(
        `Error in findOne with options: ${JSON.stringify(options)}`,
        error,
      );
      throw error;
    }
  }

  async save(team: Team): Promise<Team> {
    this.logger.log(`save called with team: ${JSON.stringify(team)}`);
    try {
      const savedTeam = await this.repo.save(team);
      this.logger.log(`save result: ${savedTeam}`);
      return savedTeam;
    } catch (error) {
      this.logger.error(
        `Error in save with team: ${JSON.stringify(team)}`,
        error,
      );
      throw error;
    }
  }

  async saves(team: Team[]): Promise<Team[]> {
    this.logger.log(`save called with teams: ${JSON.stringify(team)}`);
    try {
      const savedTeams = await this.repo.save(team);
      this.logger.log(`finish Saves`);
      return savedTeams;
    } catch (error) {
      this.logger.error(
        `Error in save with teams: ${JSON.stringify(team)}`,
        error,
      );
      throw error;
    }
  }

  async update(options: any, updateData: Partial<Team>): Promise<void> {
    this.logger.log(
      `update called with options: ${JSON.stringify(options)} and data: ${JSON.stringify(updateData)}`,
    );
    try {
      await this.repo.update(options, updateData);
      this.logger.log(
        `update completed for options: ${JSON.stringify(options)}`,
      );
    } catch (error) {
      this.logger.error(
        `Error in update with options: ${JSON.stringify(options)} and data: ${JSON.stringify(updateData)}`,
        error,
      );
      throw error;
    }
  }

  async find(options: any) {
    this.logger.log(`find called with options: ${JSON.stringify(options)}`);
    try {
      const data = await this.repo.find(options);
      this.logger.log(`find result: ${JSON.stringify(data)}`);
      return data;
    } catch (error) {
      this.logger.error(
        `Error in find with options: ${JSON.stringify(options)}}`,
        error,
      );
      throw error;
    }
  }
}
