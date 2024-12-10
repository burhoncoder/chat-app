import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ChatEntity } from '../../../chat/infra/entities/chat.entity';
import { UserEntity } from '../../../user/infra/entities/user.entity';

@Entity()
export class MessageEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ nullable: true })
  content: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => ChatEntity, (chat) => chat.messages, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'chat_id' })
  chat: ChatEntity;

  @ManyToOne(() => UserEntity, (user) => user.messages, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'author_id' })
  author: UserEntity;
}
