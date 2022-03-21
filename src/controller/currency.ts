import { RequestHandler, response } from 'express';
import httpStatus from 'http-status';
import fetch from 'node-fetch';
import { getFormattedDate } from '../util/date';

export const findUnique: RequestHandler = async (req, res) => {
  const weekBefore = new Date(new Date().getTime() - 604800000)
  const startDate = getFormattedDate(weekBefore)
  const endDate = getFormattedDate(new Date())
  
  const response = await fetch(`https://free.currconv.com/api/v7/convert?apiKey=${process.env.CURRENCY_API_KEY}&q=USD_RUB,EUR_RUB&compact=ultra&date=${startDate}&endDate=${endDate}`);
  if (response.status !== 200) {
    res.send(response.status)
  }

  const data = await response.json()
  const result = Object.entries(data).reduce((acc: any, [key, value], i: number) => {
    acc.push({
      name: key,
      data: Object.entries(value).map(([date, val]) => ({ date, value: val }))
    })
    return acc
  }, [])
  res.send(result)
}
