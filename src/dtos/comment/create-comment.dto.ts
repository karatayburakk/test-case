import { Expose } from 'class-transformer';
import { IsDefined, IsInt, IsString } from 'class-validator';

export class CreateCommentDto {
	@IsDefined()
	@IsInt()
	@Expose()
	articleId: number;

	@IsDefined()
	@IsString()
	@Expose()
	text: string;
}
