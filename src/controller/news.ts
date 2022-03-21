import { RequestHandler, response } from 'express';
import httpStatus from 'http-status';
import fetch from 'node-fetch';

export const findMany: RequestHandler = async (req, res) => {
  const { per_page, page } = req.query
  const response = await fetch(`https://newsapi.org/v2/top-headlines?country=ru&apiKey=${process.env.NEWS_API_KEY}`);
  if (response.status !== 200) {
    res.send(response.status)
  }
  const { articles } = await response.json()
  if (!page || !per_page || page >= articles.length) {
    res.send(articles)
  }

  const startIndex = Number(page) * Number(per_page)
  const endIndex = Math.min(startIndex + Number(per_page), articles.length) 
  res.send(articles.slice(startIndex, endIndex))
}
