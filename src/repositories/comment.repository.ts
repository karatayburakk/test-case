import { AppDataSource } from '../data-source';
import { Comment } from '../models/comment.model';

export const commentRepository = AppDataSource.getRepository(Comment);
