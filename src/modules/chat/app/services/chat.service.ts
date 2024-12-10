import { Injectable, NotFoundException } from '@nestjs/common';

import { CreateChatDto } from '../dto/create-chat.dto';
import { Chat } from '../../domain/chat';
import { ChatRepository } from '../../domain/chat.repository';
import { User } from '../../../user/domain/user';
import { NotificationGateway } from '../../../notification/notification.gateway';
import { NotificationResponseFactory } from '../../../notification/notification-response.factory';
import { Pageable } from '../../../../common/dto/pageable';

@Injectable()
export class ChatService {
  constructor(
    private chatRepository: ChatRepository,
    private notificationGateway: NotificationGateway,
  ) {}

  async create(dto: CreateChatDto, activeUser: User) {
    const chat: Chat = {
      name: dto.name,
      isGroup: dto.participantIds.length > 1,
      avatarUrl: dto.avatarUrl,
    };

    const participantIds = [...dto.participantIds, activeUser.id];

    const result = await this.chatRepository.create(chat, participantIds);
    this.notificationGateway.sendDataToClient(
      participantIds,
      NotificationResponseFactory.chatCreated(result.id),
    );

    return result;
  }

  async findById(id: number) {
    const chat = await this.chatRepository.findById(id);
    if (chat.isEmpty()) {
      throw new NotFoundException('Chat not found');
    }
    return chat.get();
  }

  async findParticipants(id: number) {
    return this.chatRepository.findAllParticipants(id);
  }

  async findUserChats(userId: number) {
    return this.chatRepository.findUserChats(userId);
  }

  async findChatMessages(id: number, pageable: Pageable) {
    return this.chatRepository.findChatMessages(id, pageable);
  }
}
