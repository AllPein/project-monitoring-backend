import express from 'express'
import * as  userController from '../../controller/user'
import auth from '../../middlewares/auth'

const router = express.Router()

router
  .route('/')
  .get(auth(), userController.findUnique)

export default router