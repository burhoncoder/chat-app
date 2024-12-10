import { BadRequestException, Injectable } from '@nestjs/common';

import { User } from '../../domain/user';
import { UserRepository } from '../../domain/user.repository';

import { CreateUserDto } from '../dto/create-user.dto';
import { HashingService } from './hashing.service';

@Injectable()
export class UserService {
  constructor(
    private userRepository: UserRepository,
    private hashingService: HashingService,
  ) {}

  async create(dto: CreateUserDto): Promise<User> {
    const user = await this.userRepository.findByUsername(dto.username);

    if (user.isEmpty()) {
      const hashedPassword = await this.hashingService.hash(dto.password);

      const user: User = {
        firstName: dto.firstName,
        lastName: dto.lastName,
        username: dto.username,
        password: hashedPassword,
      };

      return this.userRepository.create(user);
    } else {
      throw new BadRequestException('User already exists');
    }
  }

  async findByUsername(username: string): Promise<User> {
    const user = await this.userRepository.findByUsername(username);

    if (user.isEmpty()) {
      throw new BadRequestException('User does not exists');
    } else return user.get();
  }

  async findById(id: number): Promise<User> {
    const user = await this.userRepository.findById(id);

    if (user.isEmpty()) {
      throw new BadRequestException('User does not exists');
    } else return user.get();
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.findAll();
  }
}
