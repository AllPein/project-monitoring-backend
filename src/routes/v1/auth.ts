import express from 'express';
import { validate } from '../../middlewares/validate';
import * as authValidation from '../../validation/auth';
import * as authController from '../../controller/auth';
import * as userController from '../../controller/user';

const router = express.Router();

router.post('/login', validate(authValidation.login), authController.login);
router.post('/register', validate(authValidation.register), userController.create);

export default router;
