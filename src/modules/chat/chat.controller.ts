import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from '../auth/app/jwt/jwt.guard';
import { ActiveUser } from '../auth/app/jwt/active-user.decorator';

import { User } from '../user/domain/user';
import { ChatService } from './app/services/chat.service';
import { CreateChatDto } from './app/dto/create-chat.dto';
import { CreateMessageDto } from '../message/app/dto/create-message.dto';
import { UpdateMessageDto } from '../message/app/dto/update-message.dto';
import { MessageService } from '../message/app/services/message.service';
import { Chat } from './domain/chat';
import { Pageable } from '../../common/dto/pageable';

@UseGuards(JwtAuthGuard)
@Controller('chats')
export class ChatController {
  constructor(
    private chatService: ChatService,
    private messageService: MessageService,
  ) {}

  @Get()
  async findUserChats(@ActiveUser() activeUser: User): Promise<Chat[]> {
    return this.chatService.findUserChats(activeUser.id);
  }

  @Post()
  async create(@ActiveUser() activeUser: User, @Body() dto: CreateChatDto) {
    return this.chatService.create(dto, activeUser);
  }

  @Get(':id')
  async findById(@Param('id') id: number) {
    return this.chatService.findById(id);
  }

  @Get(':id/participants')
  async findParticipants(@Param('id') id: number) {
    return this.chatService.findParticipants(id);
  }

  @Get(':id/messages')
  async findChatMessages(@Param('id') id: number, @Query() pageable: Pageable) {
    return this.chatService.findChatMessages(id, pageable);
  }

  @Post(':id/messages')
  async createMessage(
    @ActiveUser() activeUser: User,
    @Param('id') chatId: number,
    @Body() dto: CreateMessageDto,
  ) {
    return this.messageService.create(dto, activeUser.id, chatId);
  }

  @Put(':chatId/messages/:messageId')
  async updateMessage(
    @ActiveUser() activeUser: User,
    @Param('chatId') chatId: number,
    @Param('messageId') messageId: number,
    @Body() dto: UpdateMessageDto,
  ) {
    return this.messageService.update(dto, activeUser.id, chatId, messageId);
  }

  @Delete(':chatId/messages/:messageId')
  async deleteMessage(
    @ActiveUser() activeUser: User,
    @Param('chatId') chatId: number,
    @Param('messageId') messageId: number,
  ) {
    return this.messageService.delete(activeUser.id, chatId, messageId);
  }
}
