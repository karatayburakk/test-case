import { Request, Response } from 'express';
import { CreateCommentDto, UpdateCommentDto } from '../dtos/comment';
import { commentRepository } from '../repositories/comment.repository';
import { AppError } from '../utils/AppError';
import { catchAsync } from '../utils/catch-async';
import { validateAndConvert } from '../utils/validate-and-convert';

export const getAllByArticleId = catchAsync(
	async (req: Request, res: Response): Promise<Response> => {
		const articleId = req.query.articleId;

		if (articleId === undefined)
			throw new AppError('articleId (number) should be provided in query string', 400);

		const skip = req.query.skip ? +req.query.skip : 0;
		const take = req.query.take ? +req.query.take : 50;

		const comments = await commentRepository.find({ where: { articleId: +articleId }, skip, take });

		return res.status(200).json({
			comments,
		});
	},
);

export const create = catchAsync(async (req: Request, res: Response): Promise<Response> => {
	const { payload, error } = await validateAndConvert(CreateCommentDto, req.body);
	if (error) throw new AppError(`Validation Error: ${JSON.stringify(error)}`, 400);

	const comment = commentRepository.create({
		text: payload.text,
		articleId: payload.articleId,
		userId: req.userId,
	});

	await commentRepository.save(comment);

	return res.status(201).json({
		comment,
	});
});

export const getById = catchAsync(async (req: Request, res: Response): Promise<Response> => {
	const id = +req.params.id;
	if (!id) throw new AppError('id (number) is required in request parameter !', 400);

	const comment = await commentRepository.findOneByOrFail({ id });

	return res.status(200).json({
		comment,
	});
});

export const updateById = catchAsync(async (req: Request, res: Response): Promise<Response> => {
	const id = +req.params.id;
	if (!id) throw new AppError('id (number) is required in request parameter !', 400);

	const { payload, error } = await validateAndConvert(UpdateCommentDto, req.body);
	if (error) throw new AppError(`Validation Error: ${JSON.stringify(error)}`, 400);

	const comment = await commentRepository.findOneByOrFail({ id });

	if (!isUserOwnResource(comment.userId, req.userId)) throw new AppError('Unauthorized!', 401);

	const updatedComment = await commentRepository.save({ ...comment, ...payload });

	return res.status(200).json({
		updatedComment,
	});
});

export const deleteById = catchAsync(async (req: Request, res: Response): Promise<Response> => {
	const id = +req.params.id;
	if (!id) throw new AppError('id (number) is required in request parameter !', 400);

	const comment = await commentRepository.findOneByOrFail({ id });

	if (!isUserOwnResource(comment.userId, req.userId)) throw new AppError('Unauthorized!', 401);

	await commentRepository.delete({ id });

	return res.status(204).send();
});

function isUserOwnResource(resourceUserId: number, userId: number | undefined): boolean {
	return resourceUserId === userId;
}
