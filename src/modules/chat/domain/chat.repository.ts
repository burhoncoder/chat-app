import { Chat } from './chat';
import { Optional } from '../../../shared/helpers';
import { User } from '../../user/domain/user';
import { Message } from '../../message/domain/message';
import { Pageable } from '../../../common/dto/pageable';

export abstract class ChatRepository {
  abstract create(chat: Chat, participantIds: number[]): Promise<Chat>;
  abstract findById(id: number): Promise<Optional<Chat>>;
  abstract findAllParticipants(id: number): Promise<User[]>;
  abstract findUserChats(userId: number): Promise<Chat[]>;
  abstract findChatMessages(
    chatId: number,
    pageable: Pageable,
  ): Promise<{
    meta: { total: number; totalPages: number; limit: number; page: number };
    messages: Message[];
  }>;
}
