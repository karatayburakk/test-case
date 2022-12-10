import {
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';
import { Article } from './article.model';
import { User } from './user.model';

@Entity()
export class Comment {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ nullable: false })
	text: string;

	@ManyToOne(() => User, user => user.comments, { nullable: false, cascade: true })
	@JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
	user: User;

	@Column({ name: 'user_id', nullable: false })
	userId: number;

	@ManyToOne(() => Article, article => article.comments, { nullable: false, cascade: true })
	@JoinColumn({ name: 'article_id', referencedColumnName: 'id' })
	article: Article;

	@Column({ name: 'article_id', nullable: false })
	articleId: number;

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;
}
