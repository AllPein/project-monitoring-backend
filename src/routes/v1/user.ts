import express from 'express';
import * as userController from '../../controller/user';
import auth from '../../middlewares/auth';

const router = express.Router();

router.route('/').get(auth(), userController.findUnique);
router.route('/').patch(auth(), userController.update);
router.route('/all').get(auth(), userController.findMany);
router.route('/search/:search').get(auth(), userController.search);
router.route('/search').get(auth(), userController.search);

export default router;
