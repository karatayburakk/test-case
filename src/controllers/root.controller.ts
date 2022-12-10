import { Request, Response } from 'express';

export const getHealth = (req: Request, res: Response): Response => {
	return res.status(200).send('Health is OK!');
};
