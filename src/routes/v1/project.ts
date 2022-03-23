import express from 'express';
import * as projectController from '../../controller/project';
import auth from '../../middlewares/auth';
import * as projectValidation from '../../validation/project';
import { validate } from '../../middlewares/validate';

const router = express.Router();

router
  .route('/')
  .get(auth(), projectController.getUserProjects)
  .post(auth(), validate(projectValidation.create), projectController.create)
  .patch(auth(), validate(projectValidation.update), projectController.update);

router.route('/:id').get(auth(), projectController.getUniqueProject);
router
  .route('/add-participant')
  .post(
    auth(),
    validate(projectValidation.addParticipant),
    projectController.addParticipant
  );

export default router;
