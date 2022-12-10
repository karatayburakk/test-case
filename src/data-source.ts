import { DataSource } from 'typeorm';
import { Article } from './models/article.model';
import { User } from './models/user.model';
import { Comment } from './models/comment.model';

export const AppDataSource = new DataSource({
	type: 'postgres',
	host: process.env.DB_HOST || 'data-source',
	username: process.env.DB_USERNAME || 'postgres',
	password: process.env.DB_PASSWORD || 'postgres',
	port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
	database: process.env.DB_DATABASE || 'db',
	synchronize: true,
	logging: false,
	entities: [User, Article, Comment],
});
