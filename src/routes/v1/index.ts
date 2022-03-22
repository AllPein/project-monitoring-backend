import express from 'express'
import userRoutes from './user'
import authRoutes from './user'

const router = express.Router()

router.use('/auth', authRoutes)
router.use('/user', userRoutes)

export default router
