import { ChatEntity } from '../entities/chat.entity';
import { Chat } from '../../domain/chat';

export class ChatMapper {
  static toDomain(entity: ChatEntity): Chat {
    return {
      id: entity.id,
      name: entity.name,
      avatarUrl: entity.avatarUrl,
      isGroup: entity.isGroup,
      createdAt: entity.createdAt,
    };
  }

  static toPersistence(domain: Chat): ChatEntity {
    const entity = new ChatEntity();
    entity.id = domain.id;
    entity.name = domain.name;
    entity.isGroup = domain.isGroup;
    entity.avatarUrl = domain.avatarUrl;

    return entity;
  }
}
