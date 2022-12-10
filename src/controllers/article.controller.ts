import { Request, Response } from 'express';
import { CreateArticleDto, UpdateArticleDto } from '../dtos/article';
import { articleRepository } from '../repositories/article.repository';
import { AppError } from '../utils/AppError';
import { catchAsync } from '../utils/catch-async';
import { validateAndConvert } from '../utils/validate-and-convert';

export const getAll = catchAsync(async (req: Request, res: Response): Promise<Response> => {
	const skip = req.query.skip ? +req.query.skip : 0;
	const take = req.query.take ? +req.query.take : 50;

	const articles = await articleRepository.find({ skip, take });

	return res.status(200).json({
		articles,
	});
});

export const create = catchAsync(async (req: Request, res: Response): Promise<Response> => {
	const { payload, error } = await validateAndConvert(CreateArticleDto, req.body);
	if (error) throw new AppError(`Validation Error: ${JSON.stringify(error)}`, 400);

	const article = articleRepository.create({
		title: payload.title,
		content: payload.content,
		userId: req.userId,
	});

	await articleRepository.save(article);

	return res.status(201).json(article);
});

export const getById = catchAsync(async (req: Request, res: Response): Promise<Response> => {
	const id = +req.params.id;
	if (!id) throw new AppError('id (number) is required in request parameter !', 400);

	const article = await articleRepository.findOneByOrFail({ id });

	return res.status(200).json({
		article,
	});
});

export const updateById = catchAsync(async (req: Request, res: Response): Promise<Response> => {
	const id = +req.params.id;
	if (!id) throw new AppError('id (number) is required in request parameter !', 400);

	const { payload, error } = await validateAndConvert(UpdateArticleDto, req.body);
	if (error) throw new AppError(`Validation Error: ${JSON.stringify(error)}`, 400);

	const article = await articleRepository.findOneByOrFail({ id });

	if (!isUserOwnResource(article.userId, req.userId)) throw new AppError('Unauthorized!', 401);

	const updatedArticle = await articleRepository.save({ ...article, ...payload });

	return res.status(200).json({
		updatedArticle,
	});
});

export const deleteById = catchAsync(async (req: Request, res: Response): Promise<Response> => {
	const id = +req.params.id;
	if (!id) throw new AppError('id (number) is required in request parameter !', 400);

	const article = await articleRepository.findOneByOrFail({ id });

	if (!isUserOwnResource(article.userId, req.userId)) throw new AppError('Unauthorized!', 401);

	await articleRepository.delete({ id });

	return res.status(204).send();
});

// export const sendDailyArticles = catchAsync(
// 	async (req: Request, res: Response): Promise<Response> => {
// 		const artices = await articleRepository.find({where: {createdAt: }})
// 	},
// );

function isUserOwnResource(resourceUserId: number, userId: number | undefined): boolean {
	return resourceUserId === userId;
}
