import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import { UserRepository } from '../../domain/user.repository';
import { User } from '../../domain/user';
import { Optional } from '../../../../shared/helpers';
import { UserEntity } from '../entities/user.entity';
import { UserMapper } from '../mapper/user.mapper';

@Injectable()
export class UserOrmRepository implements UserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private userOrmRepository: Repository<UserEntity>,
  ) {}

  async create(user: User): Promise<User> {
    const entity = UserMapper.toPersistence(user);
    const result = await this.userOrmRepository.save(entity);
    return UserMapper.toDomain(result);
  }

  async findByUsername(username: string): Promise<Optional<User>> {
    const result = await this.userOrmRepository.findOneBy({ username });
    return result
      ? Optional.of(UserMapper.toDomain(result))
      : Optional.ofNullable(null);
  }

  async findById(id: number): Promise<Optional<User>> {
    const result = await this.userOrmRepository.findOneBy({ id });
    return result
      ? Optional.of(UserMapper.toDomain(result))
      : Optional.ofNullable(null);
  }

  async findByIds(userIds: number[]): Promise<User[]> {
    const result = await this.userOrmRepository.findBy({ id: In(userIds) });
    return result.map(UserMapper.toDomain);
  }

  async findAll(): Promise<User[]> {
    const result = await this.userOrmRepository.find();
    return result.map(UserMapper.toDomain);
  }
}
