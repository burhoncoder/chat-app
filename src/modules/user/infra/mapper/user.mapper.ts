import { UserEntity } from '../entities/user.entity';
import { User } from '../../domain/user';

export class UserMapper {
  static toDomain(entity: UserEntity): User {
    return {
      id: entity.id,
      firstName: entity.firstName,
      lastName: entity.lastName,
      username: entity.username,
      password: entity.password,
      avatarUrl: entity.avatar,
    };
  }

  static toPersistence(domain: User): UserEntity {
    const entity = new UserEntity();
    entity.id = domain.id;
    entity.firstName = domain.firstName;
    entity.lastName = domain.lastName;
    entity.username = domain.username;
    entity.password = domain.password;
    entity.avatar = domain.avatarUrl;

    return entity;
  }
}
