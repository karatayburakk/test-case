import { Router } from 'express';
import * as authController from '../controllers/auth.controller';

const authRouter: Router = Router();

authRouter.post('/signup', authController.signup);

authRouter.post('/signin', authController.signin);

// authRouter.get('/', authController.getAll);

export { authRouter };
