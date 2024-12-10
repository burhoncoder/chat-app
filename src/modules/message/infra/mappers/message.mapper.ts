import { MessageEntity } from '../entities/message.entity';
import { Message } from '../../domain/message';
import { UserMapper } from '../../../user/infra/mapper/user.mapper';

export class MessageMapper {
  static toDomain(entity: MessageEntity): Message {
    return {
      id: entity.id,
      content: entity.content,
      createdAt: entity.createdAt,
      author: UserMapper.toDomain(entity.author),
    };
  }

  static toPersistence(domain: Message): MessageEntity {
    const entity = new MessageEntity();
    entity.id = domain.id;
    entity.content = domain.content;
    entity.createdAt = domain.createdAt;

    return entity;
  }
}
