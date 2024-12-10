import {
  Column,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ChatEntity } from '../../../chat/infra/entities/chat.entity';
import { MessageEntity } from '../../../message/infra/entities/message.entity';

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: 'first_name' })
  firstName: string;

  @Column({ name: 'last_name' })
  lastName: string;

  @Column({ unique: true })
  @Index()
  username: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  avatar: string;

  @ManyToMany(() => ChatEntity, (chat) => chat.participants)
  @JoinTable({
    name: 'chat_participants',
    joinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'chat_id',
      referencedColumnName: 'id',
    },
  })
  chats: ChatEntity[];

  @OneToMany(() => MessageEntity, (message) => message.author)
  messages: MessageEntity[];
}
