import dotenv from 'dotenv';
dotenv.config();
import 'reflect-metadata';
import express, { NextFunction, Request, Response } from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './swagger.json';
import { AppDataSource } from './data-source';
import { rootRouter } from './routes/root.router';
import { articleRouter } from './routes/article.router';
import { authRouter } from './routes/auth.router';
import { commentRouter } from './routes/comment.router';
import { globalErrorHandler } from './utils/global-error-handler';
import { AppError } from './utils/AppError';
import { dailyEmailSender } from './utils/daily-articles';
// import swaggerDocs from './utils/swagger';

const app = express();
app.use(express.json());
const port = process.env.PORT ? +process.env.PORT : 9000;

function setupExpress(): void {
	app.use('/', rootRouter);

	app.use('/auth', authRouter);
	app.use('/articles', articleRouter);
	app.use('/comments', commentRouter);

	app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

	// swaggerDocs(app, port);

	app.all('*', (req: Request, res: Response, next: NextFunction): void => {
		return next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
	});

	app.use(globalErrorHandler);
}

function startApp(): void {
	app.listen(port, () => {
		console.log(`App is now running at http://locahost:${port}`);
		console.log(`Api Docs are available at http://localhost:${port}/docs`);
	});
}

AppDataSource.initialize()
	.then(() => {
		console.log(`Data Source has been initialized successfully!`);

		setupExpress();

		startApp();

		dailyEmailSender.start();
	})
	.catch(err => {
		console.error(`Error during Data Source initialization!`, err);
		process.exit(1);
	});
