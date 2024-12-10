import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Message } from '../../domain/message';
import { MessageRepository } from '../../domain/message.repository';
import { MessageEntity } from '../entities/message.entity';
import { MessageMapper } from '../mappers/message.mapper';
import { UserRepository } from '../../../user/domain/user.repository';
import { ChatRepository } from '../../../chat/domain/chat.repository';
import { UserMapper } from '../../../user/infra/mapper/user.mapper';
import { ChatMapper } from '../../../chat/infra/mappers/chat.mapper';

@Injectable()
export class MessageOrmRepository implements MessageRepository {
  constructor(
    @InjectRepository(MessageEntity)
    private messageRepository: Repository<MessageEntity>,
    private userRepository: UserRepository,
    private chatRepository: ChatRepository,
  ) {}

  async create(message: Message, authorId: number, chatId: number) {
    const chatEntity = MessageMapper.toPersistence(message);
    chatEntity.author = UserMapper.toPersistence(
      (await this.userRepository.findById(authorId)).get(),
    );
    chatEntity.chat = ChatMapper.toPersistence(
      (await this.chatRepository.findById(chatId)).get(),
    );

    const result = await this.messageRepository.save(chatEntity);

    return MessageMapper.toDomain(result);
  }

  async update(message: Message): Promise<void> {
    await this.messageRepository.update(
      message.id,
      MessageMapper.toPersistence(message),
    );
  }

  async delete(id: number) {
    await this.messageRepository.delete(id);
  }

  async isMessageByAuthorInChat(
    messageId: number,
    authorId: number,
    chatId: number,
  ): Promise<boolean> {
    const message = await this.messageRepository
      .createQueryBuilder('message')
      .where('message.id = :messageId', { messageId })
      .andWhere('message.author_id = :authorId', { authorId })
      .andWhere('message.chat_id = :chatId', { chatId })
      .getOne();

    return !!message;
  }
}
