import { Expose } from 'class-transformer';
import { IsDefined, IsString } from 'class-validator';

export class CreateArticleDto {
	@IsDefined()
	@IsString()
	@Expose()
	title: string;

	@IsDefined()
	@IsString()
	@Expose()
	content: string;
}
