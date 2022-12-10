import { AppDataSource } from '../data-source';
import { Article } from '../models/article.model';

export const articleRepository = AppDataSource.getRepository(Article);
