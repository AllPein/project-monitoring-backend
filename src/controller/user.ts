import { RequestHandler } from 'express';
import httpStatus from 'http-status';
import { prisma } from '../app';
import { findEuclidianDistance, normalize } from '../util/math';
import pick from '../util/pick';
import { recognize } from '../util/recognize';

const MAX_DISTANCE_THRESHOLD = 1

export const findMany: RequestHandler = async (req, res) => {
  try {
    const items = await prisma.user.findMany()
    res.send(items)
  } catch (err) {
    res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR)
  }
}

export const findUnique: RequestHandler = async (req, res) => {
  const imageUrl = req.query.imageUrl
  if (!imageUrl) {
    res.send(httpStatus.BAD_REQUEST)
  }

  const embeddings = await recognize(imageUrl)
  const users = await prisma.user.findMany()
  if (!users) {
    res.send(httpStatus[400])
  }

  const { distance, user } = users.reduce((acc: any, user) => {
    acc = Math.min(acc, findEuclidianDistance(user.embeddings, embeddings))
    return { distance: acc, user }
  }, {})

  if (distance >= MAX_DISTANCE_THRESHOLD) {
    res.send(httpStatus[400])
  }
 
  res.send(user)
}

export const create: RequestHandler = async (req, res) => {
  try {
    const result = await prisma.user.create({
      data: req.body,
    })
    res.send(result)
  } catch (err) {
    console.log(err)
    res.sendStatus(httpStatus.BAD_REQUEST)
  }
};
