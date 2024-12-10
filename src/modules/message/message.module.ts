import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MessageRepository } from './domain/message.repository';
import { MessageService } from './app/services/message.service';
import { MessageOrmRepository } from './infra/repositories/message-orm.repository';
import { MessageEntity } from './infra/entities/message.entity';
import { UserModule } from '../user/user.module';
import { ChatModule } from '../chat/chat.module';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([MessageEntity]),
    UserModule,
    forwardRef(() => ChatModule),
    NotificationModule,
  ],
  providers: [
    MessageService,
    {
      provide: MessageRepository,
      useClass: MessageOrmRepository,
    },
  ],
  exports: [MessageService],
})
export class MessageModule {}
