import { Expose } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';

export class UpdateArticleDto {
	@IsOptional()
	@IsString()
	@Expose()
	title: string;

	@IsOptional()
	@IsString()
	@Expose()
	content: string;
}
