import { User } from '../../user/domain/user';

export class Message {
  id?: number;
  content: string;
  createdAt?: Date;
  updatedAt?: Date;
  author?: User;
}
