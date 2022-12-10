import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Article } from './article.model';
import { Comment } from './comment.model';

@Entity()
export class User {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ unique: true, nullable: false })
	email: string;

	@Column({ nullable: false })
	password: string;

	@OneToMany(() => Article, article => article.user)
	articles: Article[];

	@OneToMany(() => Comment, comment => comment.user)
	comments: Comment[];
}
