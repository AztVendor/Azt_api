import {
Entity,
PrimaryGeneratedColumn,
Column,
CreateDateColumn,
UpdateDateColumn,
ManyToOne,
JoinColumn,
} from 'typeorm';

import { Role } from '../../roles/entities/role.entity';

@Entity('users')
export class User {
@PrimaryGeneratedColumn('uuid')
id: string;

@Column({ unique: true })
email: string;

@Column()
password: string;

@Column()
firstName: string;

@Column({ nullable: true })
lastName: string;

@Column({ nullable: true, unique: true })
phone: string;

@ManyToOne(() => Role)
@JoinColumn({ name: 'role_id' })
role: Role;

@Column({ default: true })
isActive: boolean;

@Column({ default: false })
isEmailVerified: boolean;

@CreateDateColumn()
createdAt: Date;

@UpdateDateColumn()
updatedAt: Date;
}
