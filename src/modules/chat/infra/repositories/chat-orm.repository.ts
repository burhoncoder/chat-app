import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Optional } from '../../../../shared/helpers';

import { ChatRepository } from '../../domain/chat.repository';
import { Chat } from '../../domain/chat';
import { UserRepository } from '../../../user/domain/user.repository';
import { UserMapper } from '../../../user/infra/mapper/user.mapper';
import { ChatEntity } from '../entities/chat.entity';
import { ChatMapper } from '../mappers/chat.mapper';
import { User } from '../../../user/domain/user';
import { Message } from '../../../message/domain/message';
import { MessageMapper } from '../../../message/infra/mappers/message.mapper';
import { Pageable } from '../../../../common/dto/pageable';
import { MessageEntity } from '../../../message/infra/entities/message.entity';

@Injectable()
export class ChatOrmRepository implements ChatRepository {
  constructor(
    @InjectRepository(ChatEntity)
    private chatRepository: Repository<ChatEntity>,
    @InjectRepository(MessageEntity)
    private messageRepository: Repository<MessageEntity>,

    private userRepository: UserRepository,
  ) {}

  async create(chat: Chat, participantIds: number[]): Promise<Chat> {
    const participants = (
      await this.userRepository.findByIds(participantIds)
    ).map(UserMapper.toPersistence);

    const chatEntity = new ChatEntity();
    chatEntity.name = chat.name;
    chatEntity.avatarUrl = chat.avatarUrl;
    chatEntity.isGroup = chat.isGroup;
    chatEntity.participants = participants;

    const result = await this.chatRepository.save(chatEntity);

    return ChatMapper.toDomain(result);
  }

  async findById(id: number): Promise<Optional<Chat>> {
    const result = await this.chatRepository.findOneBy({ id });
    return result
      ? Optional.of(ChatMapper.toDomain(result))
      : Optional.ofNullable(null);
  }

  async findAllParticipants(id: number): Promise<User[]> {
    const result = await this.chatRepository.findOne({
      where: { id },
      relations: ['participants'],
    });

    return result.participants.map(UserMapper.toDomain);
  }

  async findUserChats(userId: number): Promise<Chat[]> {
    return this.chatRepository
      .createQueryBuilder('chat')
      .innerJoin(
        'chat.participants',
        'participant',
        'participant.id = :userId',
        { userId },
      )
      .getMany()
      .then((entities) => entities.map(ChatMapper.toDomain));
  }

  async findChatMessages(
    chatId: number,
    pageable: Pageable,
  ): Promise<{
    meta: { total: number; totalPages: number; limit: number; page: number };
    messages: Message[];
  }> {
    const { page, limit } = pageable;

    const skip = (page - 1) * limit; // Calculate the number of messages to skip (offset)

    const [messages, total] = await this.messageRepository
      .createQueryBuilder('message')
      .leftJoinAndSelect('message.author', 'author') // Join the author of the message
      .leftJoinAndSelect('message.chat', 'chat') // Join the chat the message belongs to
      .where('chat.id = :chatId', { chatId })
      .skip(skip) // Skip the previous pages' messages
      .take(limit) // Limit the number of messages returned
      .orderBy('message.createdAt', 'ASC') // Sort messages by creation date
      .getManyAndCount(); // Get messages and the total count

    const totalPages = Math.ceil(total / limit); // Calculate the total number of pages

    return {
      messages: messages.map(MessageMapper.toDomain),
      meta: {
        total,
        totalPages,
        page,
        limit,
      },
    };
  }
}
