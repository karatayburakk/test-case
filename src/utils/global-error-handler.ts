import { NextFunction, Request, Response } from 'express';
import { EntityNotFoundError, QueryFailedError } from 'typeorm';
import { AppError } from './AppError';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const globalErrorHandler = (err: any, req: Request, res: Response, _next: NextFunction) => {
	// TypeOrm Errors
	if (err.constructor.name === EntityNotFoundError.name) {
		return res.status(404).json({
			status: 'fail',
			message: 'No Entity Found!',
		});
	}

	if (err.constructor.name === QueryFailedError.name) {
		console.log({ err });
		// Check Conflict Errors
		if (err.detail.includes('already exists'))
			return res.status(409).json({ status: 'Conflict', message: err.detail || err.message });

		return res.status(400).json({
			status: 'fail',
			message: err.detail || err.message,
		});
	}

	// App Errors
	if (err.constructor.name === AppError.name) {
		return res.status(err.statusCode).json({
			status: err.status,
			message: err.message,
		});
	}

	// Undetected Server Errors
	return res.status(500).json({
		message: err.message,
	});
};
