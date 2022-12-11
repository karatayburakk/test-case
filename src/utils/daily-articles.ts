import { CronJob } from 'cron/';
import { MoreThan } from 'typeorm';
import { AppDataSource } from '../data-source';
import { sendEmail } from './email-sender';

const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);

const dailyCron = '* * * * *';

export const dailyEmailSender = new CronJob(dailyCron, sendDailyArticleEmail, null, false);

async function sendDailyArticleEmail(): Promise<void> {
	console.log('Daily Cron job working');
	const articles = await findAllDailyArticles();
	if (articles.length === 0) return;

	const users = await AppDataSource.getRepository('User').find();
	const usersEmails = users.map(user => user.email);

	const sendMailPromises: Promise<void>[] = [];

	for (const email of usersEmails) {
		sendMailPromises.push(
			sendEmail({
				to: email,
				subject: `Daily New Articles`,
				text: `${JSON.stringify(articles)}`,
			}),
		);
	}

	await Promise.all(sendMailPromises).catch(err => {
		console.error(err);
	});

	await AppDataSource.getRepository('Article').update(
		{ createdAt: MoreThan(yesterday), wasSentByEmail: false },
		{ wasSentByEmail: true },
	);
}

async function findAllDailyArticles(): Promise<{ title: string; content: string }[]> {
	const articles = await AppDataSource.getRepository('Article').find({
		where: { createdAt: MoreThan(yesterday), wasSentByEmail: false },
	});

	const articlesFormatted = articles.map(article => {
		return { title: article.title, content: article.content };
	});

	return articlesFormatted;
}
