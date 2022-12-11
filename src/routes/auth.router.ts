import { Router } from 'express';
import * as authController from '../controllers/auth.controller';

const authRouter: Router = Router();

authRouter.post('/signup', authController.signup);

authRouter.post('/signin', authController.signin);

authRouter.patch('/update-password', authController.protect, authController.updatePassword);

authRouter.post('/forgot-password', authController.forgotPassword);

authRouter.patch('/reset-password/:token', authController.resetPassword);

export { authRouter };
