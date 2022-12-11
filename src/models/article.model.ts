import {
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';
import { Comment } from './comment.model';
import { User } from './user.model';

@Entity()
export class Article {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ unique: true, nullable: false })
	title: string;

	@Column({ nullable: false })
	content: string;

	@Column({ default: false, select: false })
	wasSentByEmail: boolean;

	@ManyToOne(() => User, user => user.articles, { nullable: false, cascade: true })
	@JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
	user: User;

	@Column({ name: 'user_id', nullable: false })
	userId: number;

	@OneToMany(() => Comment, comment => comment.article)
	comments: Comment[];

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;
}
