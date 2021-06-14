import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { v4 as uuid } from 'uuid';

import { User } from '../../users/entities/User';

@Entity('transfers')
export class Transfer {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @ManyToOne(() => User, user => user.statement)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  user_id?: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'sender_id' })
  sender: User;

  @Column()
  sender_id: string;

  @Column()
  description: string;

  @Column('decimal', { precision: 5, scale: 2 })
  amount: number;

  @Column({default: "transfer"})
  type: string;

  @CreateDateColumn()
  created_at: Date;

  @CreateDateColumn()
  updated_at: Date;

  constructor() {
    if (!this.id) {
      this.id = uuid();
    }
  }
}

