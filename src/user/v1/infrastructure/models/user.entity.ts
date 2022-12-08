import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn
} from 'typeorm';
import { UserRoleType } from '@/user/v1/domain/user/primitives/user.roles';
import { EntityModel } from '@/shared/infrastructure/entities/decorator.entity';

@Entity()
@EntityModel()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  firstname!: string;

  @Column()
  lastname!: string;

  @Column({ unique: true })
  username!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column({
    nullable: true
  })
  phone?: string;

  @Column()
  age!: number;

  @Column({
    type: 'enum',
    enum: ['root', 'standard', 'visitor'],
    default: 'standard'
  })
  role!: UserRoleType;

  @Column({ default: true })
  active!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
