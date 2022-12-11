import nodemailer from 'nodemailer';
import { AppError } from './AppError';

interface MailOptions {
	to: string | Array<string>;
	subject: string;
	text: string;
}

export const sendEmail = async (options: MailOptions): Promise<void> => {
	const transporter = nodemailer.createTransport({
		service: 'Gmail',
		host: 'smtp.gmail.com',
		auth: {
			user: process.env.EMAIL_USER || 'example@gmail.com',
			pass: process.env.EMAIL_PASSWORD || 'pass123',
		},
	});

	const mailOptions = {
		from: process.env.EMAIL_USER || 'example@gmail.com',
		to: options.to,
		subject: options.subject,
		text: options.text,
	};

	try {
		await transporter.sendMail(mailOptions);
	} catch (err) {
		throw new AppError('Error while sending email', 500);
	}
};
