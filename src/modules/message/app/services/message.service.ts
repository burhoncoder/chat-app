import { Injectable, NotFoundException } from '@nestjs/common';

import { CreateMessageDto } from '../dto/create-message.dto';
import { Message } from '../../domain/message';
import { MessageRepository } from '../../domain/message.repository';
import { NotificationGateway } from '../../../notification/notification.gateway';
import { ChatRepository } from '../../../chat/domain/chat.repository';
import { NotificationResponseFactory } from '../../../notification/notification-response.factory';
import { UpdateMessageDto } from '../dto/update-message.dto';

@Injectable()
export class MessageService {
  constructor(
    private messageRepository: MessageRepository,
    private chatRepository: ChatRepository,
    private notificationGateway: NotificationGateway,
  ) {}

  async create(dto: CreateMessageDto, authorId: number, chatId: number) {
    const message: Message = {
      content: dto.content,
    };

    const result = await this.messageRepository.create(
      message,
      authorId,
      chatId,
    );

    const participantIds = (
      await this.chatRepository.findAllParticipants(chatId)
    ).map((item) => item.id);

    this.notificationGateway.sendDataToClient(
      participantIds,
      NotificationResponseFactory.messageCreated(result.id, chatId),
    );

    return result;
  }

  async update(
    dto: UpdateMessageDto,
    userId: number,
    chatId: number,
    messageId: number,
  ) {
    const isMessageOwner = await this.messageRepository.isMessageByAuthorInChat(
      messageId,
      userId,
      chatId,
    );

    if (!isMessageOwner) {
      throw new NotFoundException('Message not found');
    }

    const message: Message = {
      id: messageId,
      content: dto.content,
    };

    await this.messageRepository.update(message);

    const participantIds = (
      await this.chatRepository.findAllParticipants(chatId)
    ).map((item) => item.id);

    this.notificationGateway.sendDataToClient(
      participantIds,
      NotificationResponseFactory.messageUpdated(messageId, chatId),
    );
  }

  async delete(userId: number, chatId: number, messageId: number) {
    const isMessageOwner = await this.messageRepository.isMessageByAuthorInChat(
      messageId,
      userId,
      chatId,
    );

    if (!isMessageOwner) {
      throw new NotFoundException('Message not found');
    }

    await this.messageRepository.delete(messageId);
  }
}
