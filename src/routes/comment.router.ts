import { Router } from 'express';
import { protect } from '../controllers/auth.controller';
import * as commentController from '../controllers/comment.controller';

const commentRouter: Router = Router();

commentRouter.get('/', commentController.getAllByArticleId);

commentRouter.post('/', protect, commentController.create);

commentRouter.get('/:id', commentController.getById);

commentRouter.patch('/:id', protect, commentController.updateById);

commentRouter.delete('/:id', protect, commentController.deleteById);

export { commentRouter };
