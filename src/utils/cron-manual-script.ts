import dotenv from 'dotenv';
dotenv.config();
import { dailyEmailSender } from './daily-articles';
import { Article } from '../models/article.model';
import { User } from '../models/user.model';
import { Comment } from '../models/comment.model';
import { DataSource } from 'typeorm';

const AppDataSource = new DataSource({
	type: 'postgres',
	host: 'localhost',
	username: process.env.DB_USERNAME || 'postgres',
	password: process.env.DB_PASSWORD || 'postgres',
	port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
	database: process.env.DB_DATABASE || 'db',
	synchronize: true,
	logging: false,
	entities: [User, Article, Comment],
});

if (process.argv[2] === '--start') {
	console.log('Daily Cron Job For Sending Emails Started!');
	AppDataSource.initialize()
		.then(() => {
			dailyEmailSender.start();
		})
		.catch((err: any) => {
			console.error(err);
		});
}
