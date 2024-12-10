import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserModule } from '../user/user.module';
import { ChatController } from './chat.controller';

import { ChatRepository } from './domain/chat.repository';
import { ChatService } from './app/services/chat.service';
import { ChatOrmRepository } from './infra/repositories/chat-orm.repository';
import { ChatEntity } from './infra/entities/chat.entity';
import { NotificationModule } from '../notification/notification.module';
import { MessageModule } from '../message/message.module';
import { MessageEntity } from '../message/infra/entities/message.entity';

@Module({
  imports: [
    MessageModule,
    NotificationModule,
    UserModule,
    TypeOrmModule.forFeature([ChatEntity, MessageEntity]),
  ],
  controllers: [ChatController],
  providers: [
    ChatService,
    { provide: ChatRepository, useClass: ChatOrmRepository },
  ],
  exports: [ChatRepository],
})
export class ChatModule {}
