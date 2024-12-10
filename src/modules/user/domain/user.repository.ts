import { User } from './user';
import { Optional } from '../../../shared/helpers';

export abstract class UserRepository {
  abstract create(user: User): Promise<User>;
  abstract findByUsername(username: string): Promise<Optional<User>>;
  abstract findById(id: number): Promise<Optional<User>>;
  abstract findByIds(userIds: number[]): Promise<User[]>;
  abstract findAll(): Promise<User[]>;
}
