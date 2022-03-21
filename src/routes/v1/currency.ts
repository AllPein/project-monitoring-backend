import express from 'express'
import * as currencyController from '../../controller/currency'

const router = express.Router()

router.route('').get(currencyController.findUnique)

export default router