import { Expose } from 'class-transformer';
import { IsDefined, IsEmail, IsString, MinLength } from 'class-validator';

export class SignupDto {
	@IsDefined()
	@IsEmail()
	@Expose()
	email: string;

	@IsDefined()
	@IsString()
	@MinLength(3)
	@Expose()
	password: string;

	@IsDefined()
	@IsString()
	passwordConfirm: string;
}
