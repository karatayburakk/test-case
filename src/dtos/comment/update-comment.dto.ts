import { Expose } from 'class-transformer';
import { IsDefined, IsString } from 'class-validator';

export class UpdateCommentDto {
	@IsDefined()
	@IsString()
	@Expose()
	text: string;
}
