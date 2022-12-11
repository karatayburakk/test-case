import { NextFunction, Request, Response } from 'express';
import { genSalt, hash, compare } from 'bcryptjs';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { SigninDto, SignupDto } from '../dtos/auth';
import { userRepository } from '../repositories/user.repository';
import { AppError } from '../utils/AppError';
import { catchAsync } from '../utils/catch-async';
import { validateAndConvert } from '../utils/validate-and-convert';
import { sendEmail } from '../utils/email-sender';

export const signup = catchAsync(async (req: Request, res: Response): Promise<Response> => {
	const { payload, error } = await validateAndConvert(SignupDto, req.body);
	if (error) throw new AppError(`Validation Error: ${JSON.stringify(error)}`, 400);

	if (!isPasswordsMatch(payload.password, payload.passwordConfirm))
		throw new AppError('Passwords do not match!', 400);

	const hashPassword = await encryptPassword(payload.password);
	delete payload.password;

	const user = userRepository.create({
		password: hashPassword,
		email: payload.email,
	});

	await userRepository.insert(user);

	const token = generateToken(user.id);

	return res.status(201).json({
		email: user.email,
		createdAt: user.createdAt,
		updatedAt: user.updatedAt,
		token,
	});
});

export const signin = catchAsync(async (req: Request, res: Response): Promise<Response> => {
	const { payload, error } = await validateAndConvert(SigninDto, req.body);
	if (error) throw new AppError(`Validation Error: ${JSON.stringify(error)}`, 400);

	const { email, password } = payload;

	const user = await userRepository.findOneBy({ email });

	if (!user) throw new AppError('Username or Password is incorrect', 400);

	if (!(await isPasswordCorrect(password, user.password)))
		throw new AppError('Username or Password is incorrect!', 400);

	const token = generateToken(user.id);

	return res.status(200).json({
		token,
	});
});

export const updatePassword = catchAsync(async (req: Request, res: Response): Promise<Response> => {
	const { password, passwordConfirm } = req.body;

	if (!password || !passwordConfirm || !isPasswordsMatch(password, passwordConfirm))
		throw new AppError('Please provide password and passwordConfirm', 400);

	const hashPassword = await encryptPassword(password);

	await userRepository.update({ id: req.userId }, { password: hashPassword });

	return res.status(200).json({
		status: 'success',
		message: 'Password changed successfully!',
	});
});

export const forgotPassword = catchAsync(async (req: Request, res: Response): Promise<Response> => {
	const { email } = req.body;
	if (!email) throw new AppError('Pleave provide an email', 400);

	const user = await userRepository.findOneBy({ email });
	if (!user) throw new AppError('No user for given email', 404);

	const resetPasswordToken = generatePasswordToken(email);

	const resetURL = `${req.protocol}://${req.get('host')}/auth/reset-password/${resetPasswordToken}`;

	await sendEmail({
		to: user.email,
		subject: 'Forgot Password',
		text: `Forgot your Password? Submit a PATCH request with your new password and passwordConfirm to ${resetURL}`,
	});

	return res.status(200).json({
		status: 'success',
		message: 'Password Recover Mail send successfully!',
	});
});

export const resetPassword = catchAsync(async (req: Request, res: Response): Promise<Response> => {
	const { password, passwordConfirm } = req.body;
	if (!password || !passwordConfirm || !isPasswordsMatch(password, passwordConfirm))
		throw new AppError('Please provide password and passwordConfirm', 400);

	const { token } = req.params;
	if (!token) throw new AppError('Please provide a valid token', 400);

	const hashPassword = await encryptPassword(password);

	const decoded = decodeToken(token);

	await userRepository.update({ email: decoded.email }, { password: hashPassword });

	return res.status(200).json({
		status: 'success',
		message: 'Password changed successfully!',
	});
});

export const protect = catchAsync(
	async (req: Request, res: Response, next: NextFunction): Promise<void> => {
		if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer'))
			throw new AppError('Unauthrozied!', 401);

		const token = req.headers.authorization.split(' ')[1];

		const decoded = decodeToken(token);

		const user = await userRepository.findOneBy({ id: decoded.id });

		if (!user) throw new AppError('User with this token no longer exist!', 401);

		req.userId = user.id;

		next();
	},
);

function isPasswordsMatch(password: string, passwordConfirm: string): boolean {
	return password === passwordConfirm;
}

async function encryptPassword(password: string): Promise<string> {
	const salt = await genSalt();
	const hashPassword = await hash(password, salt);
	return hashPassword;
}

function generateToken(id: number): string {
	const payload = { id };
	const token = jwt.sign(payload, process.env.JWT_SECRET || 'Secret', { expiresIn: '30d' });
	return token;
}

function generatePasswordToken(email: string): string {
	const payload = { email };
	const token = jwt.sign(payload, process.env.JWT_SECRET || 'Secret', { expiresIn: '10m' });
	return token;
}

async function isPasswordCorrect(input: string, password: string): Promise<boolean> {
	return await compare(input, password);
}

function decodeToken(token: string): JwtPayload {
	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET || 'Secret');
		return decoded as JwtPayload;
	} catch (err) {
		throw new AppError('Unvalid Token!', 401);
	}
}
