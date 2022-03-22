import express from 'express'
import { validate } from '../../middlewares/validate'
import * as authValidation from '../../validation/auth'
import * as authController from '../../controller/auth'

const router = express.Router()

router.post('/login', validate(authValidation.login), authController.login)

export default router