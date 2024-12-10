import { Message } from './message';

export abstract class MessageRepository {
  abstract create(
    message: Message,
    authorId: number,
    chatId: number,
  ): Promise<Message>;

  abstract update(message: Message): Promise<void>;

  abstract delete(id: number): Promise<void>;

  abstract isMessageByAuthorInChat(
    messageId: number,
    authorId: number,
    chatId: number,
  ): Promise<boolean>;
}
