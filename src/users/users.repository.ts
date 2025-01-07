import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserRepository {
  private readonly logger = new Logger(UserRepository.name);
  constructor(
    @InjectRepository(User) private readonly repo: Repository<User>,
  ) {}

  async findById(id: string, option?: any): Promise<User | undefined> {
    this.logger.log(`findById called with id: ${id}`);
    try {
      const user = await this.repo.findOne({ where: { id }, ...option });
      this.logger.log(`findById result: ${user}`);
      return user;
    } catch (error) {
      this.logger.error(`Error in findById with id: ${id}`, error);
      throw error;
    }
  }

  async findByUserId(userId: string, option?: any): Promise<User | undefined> {
    this.logger.log(`findByUserId called with userId: ${userId}`);
    try {
      const user = await this.repo.findOne({ where: { userId }, ...option });
      this.logger.log(`findByUserId result: ${user}`);
      return user;
    } catch (error) {
      this.logger.error(`Error in findByUserId with userId: ${userId}`, error);
      throw error;
    }
  }

  async createUser(userData: Partial<User>): Promise<User> {
    this.logger.log(`createUser called with data: ${JSON.stringify(userData)}`);
    try {
      const savedUser = await this.repo.save(this.repo.create(userData));
      this.logger.log(`createUser result: ${savedUser}`);
      return savedUser;
    } catch (error) {
      this.logger.error(
        `Error in createUser with data: ${JSON.stringify(userData)}`,
        error,
      );
      throw error;
    }
  }

  async updateUser(
    id: string,
    updateData: Partial<User>,
  ): Promise<User | undefined> {
    this.logger.log(
      `updateUser called with id: ${id} and data: ${JSON.stringify(updateData)}`,
    );
    try {
      await this.update({ id }, updateData);
      const updatedUser = await this.findById(id);
      this.logger.log(`updateUser result: ${updatedUser}`);
      return updatedUser;
    } catch (error) {
      this.logger.error(
        `Error in updateUser with id: ${id} and data: ${JSON.stringify(updateData)}`,
        error,
      );
      throw error;
    }
  }

  async deleteUser(id: string): Promise<void> {
    this.logger.log(`deleteUser called with id: ${id}`);
    try {
      await this.repo.delete({ id });
      this.logger.log(`deleteUser completed for id: ${id}`);
    } catch (error) {
      this.logger.error(`Error in deleteUser with id: ${id}`, error);
      throw error;
    }
  }

  async findOne(options: any): Promise<User | undefined> {
    this.logger.log(`findOne called with options: ${JSON.stringify(options)}`);
    try {
      const user = await this.repo.findOne(options);
      this.logger.log(`findOne result: ${user}`);
      return user;
    } catch (error) {
      this.logger.error(
        `Error in findOne with options: ${JSON.stringify(options)}`,
        error,
      );
      throw error;
    }
  }

  async save(user: User): Promise<User> {
    this.logger.log(`save called with user: ${JSON.stringify(user)}`);
    try {
      const savedUser = await this.repo.save(user);
      this.logger.log(`save result: ${savedUser}`);
      return savedUser;
    } catch (error) {
      this.logger.error(
        `Error in save with user: ${JSON.stringify(user)}`,
        error,
      );
      throw error;
    }
  }

  async update(options: any, updateData: Partial<User>): Promise<void> {
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

  async delete(options: any): Promise<void> {
    this.logger.log(`delete called with options: ${JSON.stringify(options)}`);
    try {
      await this.repo.delete(options);
      this.logger.log(
        `delete completed for options: ${JSON.stringify(options)}`,
      );
    } catch (error) {
      this.logger.error(
        `Error in delete with options: ${JSON.stringify(options)}`,
        error,
      );
      throw error;
    }
  }
}
