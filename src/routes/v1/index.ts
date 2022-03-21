import express from 'express';
import weather from './weather';
import * as currencyController from '../../controller/currency'
import * as newsController from '../../controller/news'

const router = express.Router();

router.use('/weather', weather);
router.get('/currency', currencyController.findUnique)
router.get('/news', newsController.findMany)

export default router;
