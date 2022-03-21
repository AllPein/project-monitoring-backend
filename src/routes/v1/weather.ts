import express from 'express'
import * as weatherController from '../../controller/weather'

const router = express.Router()

router.route('/:city').get(weatherController.findUnique)

export default router