import { CronJob } from 'cron/';
import { MoreThan } from 'typeorm';
import { articleRepository } from '../repositories/article.repository';

export const dailyEmailSender = new CronJob('* * * * *', sendDailyArticleEmail, null, true);

async function sendDailyArticleEmail(): Promise<void> {
	console.log(new Date());
	const articles = await articleRepository.find({ where: { createdAt: MoreThan(yesterday) } });
	console.log(articles);
}

const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
