import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserController } from './user.controller';

import { UserRepository } from './domain/user.repository';
import { HashingService } from './app/services/hashing.service';
import { UserService } from './app/services/user.service';
import { UserOrmRepository } from './infra/repositories/user-orm.repository';
import { UserEntity } from './infra/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [UserController],
  providers: [
    UserService,
    HashingService,
    {
      provide: UserRepository,
      useClass: UserOrmRepository,
    },
  ],
  exports: [UserService, HashingService, UserRepository],
})
export class UserModule {}
