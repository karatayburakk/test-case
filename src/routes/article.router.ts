import { Router } from 'express';
import * as articleController from '../controllers/article.controller';
import { protect } from '../controllers/auth.controller';

const articleRouter: Router = Router();

articleRouter.get('/', articleController.getAll);

articleRouter.post('/', protect, articleController.create);

articleRouter.get('/:id', articleController.getById);

articleRouter.patch('/:id', protect, articleController.updateById);

articleRouter.delete('/:id', protect, articleController.deleteById);

export { articleRouter };
