import { Router } from 'express';
import * as rootController from '../controllers/root.controller';

const rootRouter: Router = Router();

rootRouter.route('/').get(rootController.getHealth);

export { rootRouter };
